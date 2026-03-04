function header(){
  return(      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
            <p className="text-gray-400">مرحباً بك في نظام التحكم المالي الذكي</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all">
              تصدير التقرير
            </button>
          </div>
        </div>)
};

export default header;
