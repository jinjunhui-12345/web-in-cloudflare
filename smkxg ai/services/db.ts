
import { createClient } from '@supabase/supabase-js';
import { Reservation, ReservationFormData } from '../types';

// 安全地获取环境变量，防止在某些环境下 crash
const getEnv = (key: string) => {
  try {
    return (import.meta as any).env?.[key];
  } catch (e) {
    console.warn('Error reading env var:', key);
    return undefined;
  }
};

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
const SUPABASE_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

// 如果环境变量存在，初始化 Supabase 客户端
const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

const STORAGE_KEY = 'life_science_museum_reservations';

// 模拟网络延迟（用于 LocalStorage 模式下保持体验一致）
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  // 获取所有预约
  getAll: async (): Promise<Reservation[]> => {
    // 1. 优先尝试云端数据库
    if (supabase) {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('submit_time', { ascending: false });
      
      if (error) {
        console.error('Supabase fetch error:', error);
        return [];
      }
      
      // 映射数据库字段(snake_case)到前端模型(camelCase)
      return data.map(row => ({
        id: row.id,
        name: row.name,
        identity: row.identity || '', // 兼容旧数据
        phone: row.phone,
        visitDate: row.visit_date,
        visitTime: row.visit_time || '09:00', // 兼容旧数据
        remarks: row.remarks || '',
        submitTime: row.submit_time,
        status: row.status as any
      }));
    }

    // 2. 降级到 LocalStorage
    await delay(300);
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load reservations", e);
      return [];
    }
  },

  // 根据ID获取单个预约
  getById: async (id: string): Promise<Reservation | undefined> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error || !data) return undefined;
      
      return {
        id: data.id,
        name: data.name,
        identity: data.identity || '',
        phone: data.phone,
        visitDate: data.visit_date,
        visitTime: data.visit_time || '09:00',
        remarks: data.remarks || '',
        submitTime: data.submit_time,
        status: data.status as any
      };
    }

    await delay(300);
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return all.find((r: Reservation) => r.id === id);
  },

  // 添加新预约
  add: async (data: ReservationFormData): Promise<Reservation> => {
    const submitTime = new Date().toISOString();
    
    if (supabase) {
      // Supabase 自动生成 ID
      const { data: inserted, error } = await supabase
        .from('reservations')
        .insert([{
          name: data.name,
          identity: data.identity,
          phone: data.phone,
          visit_date: data.visitDate,
          visit_time: data.visitTime,
          remarks: data.remarks,
          submit_time: submitTime,
          status: 'confirmed'
        }])
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: inserted.id,
        name: inserted.name,
        identity: inserted.identity,
        phone: inserted.phone,
        visitDate: inserted.visit_date,
        visitTime: inserted.visit_time,
        remarks: inserted.remarks,
        submitTime: inserted.submit_time,
        status: inserted.status as any
      };
    }

    // LocalStorage 模式
    await delay(500);
    const newId = crypto.randomUUID();
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newReservation: Reservation = {
      ...data,
      id: newId,
      submitTime,
      status: 'confirmed',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newReservation, ...all]));
    return newReservation;
  },

  // 更新预约
  update: async (id: string, updates: Partial<Reservation>): Promise<Reservation | null> => {
     if (supabase) {
       // 映射更新字段
       const dbUpdates: any = {};
       if (updates.name) dbUpdates.name = updates.name;
       if (updates.identity) dbUpdates.identity = updates.identity;
       if (updates.phone) dbUpdates.phone = updates.phone;
       if (updates.visitDate) dbUpdates.visit_date = updates.visitDate;
       if (updates.visitTime) dbUpdates.visit_time = updates.visitTime;
       if (updates.remarks !== undefined) dbUpdates.remarks = updates.remarks;
       if (updates.status) dbUpdates.status = updates.status;

      const { data, error } = await supabase
        .from('reservations')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        identity: data.identity,
        phone: data.phone,
        visitDate: data.visit_date,
        visitTime: data.visit_time,
        remarks: data.remarks,
        submitTime: data.submit_time,
        status: data.status as any
      };
    }

    await delay(300);
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const index = all.findIndex((r: Reservation) => r.id === id);
    if (index === -1) return null;

    const updatedRecord = { ...all[index], ...updates };
    all[index] = updatedRecord;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return updatedRecord;
  },

  // 删除预约
  delete: async (id: string): Promise<void> => {
    if (supabase) {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    await delay(300);
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = all.filter((r: Reservation) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
};