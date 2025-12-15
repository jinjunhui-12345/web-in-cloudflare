
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, User, Phone, Clock, ArrowLeft, Download, Search, CreditCard, Watch } from 'lucide-react';
import { db } from '../services/db';
import { Reservation } from '../types';

export default function Success() {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      if (id) {
        try {
          const data = await db.getById(id);
          if (data) {
            setReservation(data);
          }
        } catch (error) {
          console.error("Failed to fetch reservation", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReservation();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-science-600"></div>
        <p className="mt-4 text-gray-500">正在加载预约信息...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-gray-400 mb-4">
          <Search size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">未找到预约记录</h2>
        <p className="text-gray-500 mt-2 mb-6">该预约不存在或已被删除。</p>
        <Link to="/" className="text-science-600 hover:text-science-700 font-medium flex items-center gap-1">
          <ArrowLeft size={16} /> 返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5">
          {/* Header */}
          <div className="bg-science-600 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-science-100" />
            <h1 className="text-2xl font-bold">预约成功</h1>
            <p className="text-science-100 mt-2">您的参观申请已提交</p>
          </div>

          {/* Ticket Body */}
          <div className="p-8 relative bg-white">
            {/* Dashed line decoration */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gray-200 border-t-2 border-dashed border-gray-300"></div>
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-50 rounded-full"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-50 rounded-full"></div>

            <div className="space-y-6 pt-4">
              <div className="flex flex-col items-center justify-center pb-6 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">预约编号</span>
                <span className="font-mono text-xl font-bold text-gray-900 mt-1">#{reservation.id.slice(0, 8).toUpperCase()}</span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 {/* Name */}
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-science-50 flex items-center justify-center flex-shrink-0 text-science-600">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">参观人</p>
                      <p className="font-semibold text-gray-900 text-lg">{reservation.name}</p>
                    </div>
                 </div>

                 {/* Identity (New) */}
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-science-50 flex items-center justify-center flex-shrink-0 text-science-600">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">身份信息</p>
                      <p className="font-semibold text-gray-900 text-lg">{reservation.identity}</p>
                    </div>
                 </div>

                 {/* Date & Time */}
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-science-50 flex items-center justify-center flex-shrink-0 text-science-600">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">参观时间</p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-lg">{reservation.visitDate}</span>
                        <span className="bg-science-100 text-science-800 text-xs px-2 py-1 rounded-full font-medium">{reservation.visitTime}</span>
                      </div>
                    </div>
                 </div>

                 {/* Phone */}
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-science-50 flex items-center justify-center flex-shrink-0 text-science-600">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">联系电话</p>
                      <p className="font-semibold text-gray-900 text-lg">{reservation.phone}</p>
                    </div>
                 </div>

                 {/* Submit Time */}
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-500">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">填写时间</p>
                      <p className="text-gray-700">{new Date(reservation.submitTime).toLocaleString()}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-xs text-yellow-800 leading-relaxed text-center">
                温馨提示：请于预约当日凭此页面或截图，在入口处经工作人员核验后入馆。
              </p>
            </div>

            <div className="mt-8 flex gap-3 print:hidden">
              <Link to="/" className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-center text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                返回首页
              </Link>
              <button 
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 bg-science-600 rounded-xl text-center text-white font-medium hover:bg-science-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} /> 保存/打印
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
    