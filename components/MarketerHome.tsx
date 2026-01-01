
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';

interface Question {
  id: string;
  text: string;
  type: 'SINGLE' | 'MULTIPLE';
  options: string[];
  required: boolean;
}

interface Activity {
  id: string;
  title: string;
  type: string;
  questionsCount: number;
  participants: string;
  cover: string;
  color: string;
  intro: string;
  questions: Question[];
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  wsmTime: string;
  faceToFaceTime?: string;
  companyName: string;
  submissionTime: string;
  activityId?: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '您目前最关注的保障领域是？',
    type: 'SINGLE',
    options: ['重疾保障', '养老储备', '子女教育', '财富传承'],
    required: true
  },
  {
    id: 'q2',
    text: '您家庭每年的保费支出预算大约是？',
    type: 'SINGLE',
    options: ['1万以下', '1-3万', '3-5万', '5-10万', '10万以上'],
    required: true
  },
  {
    id: 'q3',
    text: '您目前已配置了哪些类型的保险？（可多选）',
    type: 'MULTIPLE',
    options: ['意外险', '医疗险', '重疾险', '寿险', '理财型保险', '尚未配置'],
    required: false
  },
  {
    id: 'q4',
    text: '您希望通过本次“面对面”活动获得什么帮助？',
    type: 'SINGLE',
    options: ['保单整理', '方案设计', '产品咨询', '仅做了解'],
    required: true
  }
];

const MOCK_ACTIVITIES: Activity[] = [
  { 
    id: 'a1', 
    title: '职域基本情况访谈', 
    type: '调研', 
    questionsCount: 4, 
    participants: '1.2k', 
    cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400',
    color: 'from-blue-500 to-indigo-600',
    intro: '本调研旨在了解您在职域环境下的基本保障需求，帮助我们为您提供更精准的保险服务。整个流程大约耗时3-5分钟。',
    questions: MOCK_QUESTIONS
  },
  { 
    id: 'a2', 
    title: '家庭保障需求测评', 
    type: '测评', 
    questionsCount: 4, 
    participants: '856', 
    cover: 'https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=400',
    color: 'from-emerald-500 to-teal-600',
    intro: '家庭保障需求测评是制定科学保障方案的第一步。我们将分析您的家庭结构与经济状况。',
    questions: MOCK_QUESTIONS
  }
];

const MOCK_RECOMMENDED: Customer[] = [
  { id: 'r1', name: '张**', phone: '13888888888', wsmTime: '2023-10-25 10:00', companyName: '某大型科技集团', submissionTime: '2023-10-25 10:30', activityId: 'a1' },
  { id: 'r2', name: '李**', phone: '13977777777', wsmTime: '2023-10-24 14:30', companyName: '华夏商贸有限公司', submissionTime: '2023-10-24 15:00', activityId: 'a2' },
  { id: 'r3', name: '王**', phone: '15012345678', wsmTime: '2023-10-26 09:15', companyName: '顶峰创意工作室', submissionTime: '2023-10-26 09:45', activityId: 'a1' }
];

const MOCK_PARTICIPANTS: Customer[] = [
  { id: 'p1', name: '赵**', phone: '13588881234', wsmTime: '2023-10-20 09:00', companyName: '字节跳动', submissionTime: '2023-10-27 10:15', activityId: 'a1' },
  { id: 'p2', name: '钱**', phone: '18612345678', wsmTime: '2023-10-21 14:00', companyName: '腾讯控股', submissionTime: '2023-10-27 11:30', activityId: 'a1' },
  { id: 'p3', name: '孙**', phone: '13144449999', wsmTime: '2023-10-22 10:30', companyName: '美团点评', submissionTime: '2023-10-27 14:00', activityId: 'a2' }
];

const MOCK_SUBMISSIONS: Record<string, Record<string, string | string[]>> = {
  'p1': { 'q1': '重疾保障', 'q2': '3-5万', 'q3': ['医疗险', '意外险'], 'q4': '产品咨询' },
  'p2': { 'q1': '养老储备', 'q2': '5-10万', 'q3': ['寿险', '重疾险'], 'q4': '保单整理' },
  'p3': { 'q1': '财富传承', 'q2': '10万以上', 'q3': ['理财型保险'], 'q4': '方案设计' }
};

export type QRStatus = 'pending' | 'locked' | 'expired' | 'success' | 'failure';

const maskPhone = (phone: string) => {
  if (phone.length !== 11) return phone;
  return `${phone.substring(0, 3)}****${phone.substring(7)}`;
};

const SimulatedQRCode: React.FC<{ seed: number; status: QRStatus }> = ({ seed, status }) => {
  const grid = useMemo(() => {
    const dots = [];
    const size = 25;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const isTopLeft = x < 7 && y < 7;
        const isTopRight = x > 17 && y < 7;
        const isBottomLeft = x < 7 && y > 17;
        if (!isTopLeft && !isTopRight && !isBottomLeft) {
          if (Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453 > 0) {
            dots.push(<rect key={`${x}-${y}`} x={x * 4} y={y * 4} width="3" height="3" rx="0.5" fill="currentColor" />);
          }
        }
      }
    }
    return dots;
  }, [seed]);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
      <path d="M0,0 h28 v28 h-28 z M4,4 v20 h20 v-20 h-20 z M8,8 h12 v12 h-12 z" fill="currentColor" />
      <path d="M72,0 h28 v28 h-28 z M76,4 v20 h20 v-20 h-20 z M80,8 h12 v12 h-12 z" fill="currentColor" />
      <path d="M0,72 h28 v28 h-28 z M4,76 v20 h20 v-20 h-20 z M8,80 h12 v12 h-12 z" fill="currentColor" />
      <g>{grid}</g>
    </svg>
  );
};

export const MarketerHome: React.FC = () => {
  type ViewMode = 'RECOMMENDED' | 'PARTICIPATING' | 'ACTIVITY_SELECTION' | 'FILLING' | 'PREVIEW' | 'SUBMISSION_VIEW';
  const [view, setView] = useState<ViewMode>('RECOMMENDED');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const [qrStatus, setQrStatus] = useState<QRStatus>('pending');
  const [timeLeft, setTimeLeft] = useState(20);
  const [qrSeed, setQrSeed] = useState(Math.random());

  const isModalOpenRef = useRef(isModalOpen);
  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
    (window as any).__PAD_QR_STATE__ = { isOpen: isModalOpen, status: qrStatus };
  }, [isModalOpen, qrStatus]);

  const generateNewQR = useCallback(() => {
    setQrStatus('pending');
    setTimeLeft(20);
    setQrSeed(Math.random());
  }, []);

  const handleOpenModal = () => {
    generateNewQR();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleAcceptConfirm = () => {
    setIsConfirmModalOpen(false);
    setView('ACTIVITY_SELECTION');
  };

  const handleCancelConfirm = () => setIsConfirmModalOpen(false);

  const handleReturn = () => {
    if (view === 'FILLING' || view === 'PREVIEW') {
      setView('ACTIVITY_SELECTION');
      setAnswers({});
    } else if (view === 'SUBMISSION_VIEW') {
      setView('PARTICIPATING');
      setSelectedCustomer(null);
      setSelectedActivity(null);
      setAnswers({});
    } else {
      setView('RECOMMENDED');
      setSelectedActivity(null);
      setAnswers({});
    }
  };

  useEffect(() => {
    let timer: number;
    if (isModalOpen && qrStatus === 'pending' && timeLeft > 0) {
      timer = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && qrStatus === 'pending') {
      setQrStatus('expired');
    }
    return () => clearInterval(timer);
  }, [isModalOpen, qrStatus, timeLeft]);

  useEffect(() => {
    const handleLock = () => setQrStatus('locked');
    const handleReset = () => setQrStatus('pending');
    const handleConfirm = () => {
      if (!isModalOpenRef.current) return;
      setQrStatus('success');
      setTimeout(() => {
        if (isModalOpenRef.current) {
          setIsModalOpen(false);
          setIsConfirmModalOpen(true);
        }
      }, 800);
    };

    window.addEventListener('pad-lock-qr', handleLock);
    window.addEventListener('pad-reset-qr', handleReset);
    window.addEventListener('pad-confirm-qr', handleConfirm);
    return () => {
      window.removeEventListener('pad-lock-qr', handleLock);
      window.removeEventListener('pad-reset-qr', handleReset);
      window.removeEventListener('pad-confirm-qr', handleConfirm);
    };
  }, []);

  const handleStartFill = (activity: Activity, mode: 'FILLING' | 'PREVIEW') => {
    setSelectedActivity(activity);
    setCurrentQIndex(0);
    setAnswers({});
    setView(mode);
  };

  const handleViewSubmission = (customer: Customer) => {
    const activity = MOCK_ACTIVITIES.find(a => a.id === customer.activityId) || MOCK_ACTIVITIES[0];
    const customerAnswers = MOCK_SUBMISSIONS[customer.id] || {};
    setSelectedCustomer(customer);
    setSelectedActivity(activity);
    setAnswers(customerAnswers);
    setView('SUBMISSION_VIEW');
  };

  const handleOptionToggle = (questionId: string, option: string, type: 'SINGLE' | 'MULTIPLE') => {
    if (view === 'PREVIEW' || view === 'SUBMISSION_VIEW') return; 
    setAnswers(prev => {
      if (type === 'SINGLE') {
        return { ...prev, [questionId]: option };
      } else {
        const current = (prev[questionId] as string[]) || [];
        const next = current.includes(option) ? current.filter(o => o !== option) : [...current, option];
        return { ...prev, [questionId]: next };
      }
    });
  };

  const currentQuestion = selectedActivity?.questions[currentQIndex];
  const canProceed = !currentQuestion?.required || (currentQuestion.type === 'SINGLE' ? !!answers[currentQuestion.id] : ((answers[currentQuestion.id] as string[])?.length > 0));
  const isLastQuestion = selectedActivity && currentQIndex === selectedActivity.questions.length - 1;

  const handleSubmit = () => setIsSuccessModalOpen(true);

  const closeAndReset = () => {
    setIsSuccessModalOpen(false);
    setView('RECOMMENDED');
    setSelectedActivity(null);
    setAnswers({});
  };

  const sortedRecommended = useMemo(() => {
    return [...MOCK_RECOMMENDED].sort((a, b) => {
      const timeA = new Date(a.submissionTime).getTime();
      const timeB = new Date(b.submissionTime).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [sortOrder]);

  const isQuizMode = view === 'FILLING' || view === 'PREVIEW' || view === 'SUBMISSION_VIEW';

  const renderQuestionCard = (question: Question, index: number, isInteractive: boolean) => (
    <div key={question.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-black text-[#d31145] tracking-widest uppercase">
          {question.type === 'SINGLE' ? '单选题' : '多选题'}
        </span>
        {question.required && <span className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full text-[10px] font-bold">必填</span>}
      </div>
      
      <h3 className="text-xl font-black text-slate-800 mb-8 leading-snug">{index + 1}. {question.text}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = question.type === 'SINGLE' 
            ? answers[question.id] === option
            : ((answers[question.id] as string[]) || []).includes(option);
          
          return (
            <div
              key={idx}
              className={`
                w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group
                ${isSelected 
                  ? 'border-[#d31145] bg-[#d31145]/5 text-[#d31145]' 
                  : 'border-slate-100 bg-slate-50 text-slate-600 ' + (isInteractive ? 'hover:border-slate-200 cursor-pointer' : 'cursor-default')}
              `}
              onClick={() => isInteractive && handleOptionToggle(question.id, option, question.type)}
            >
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                ${isSelected ? 'bg-[#d31145] border-[#d31145]' : 'border-slate-300 bg-white ' + (isInteractive ? 'group-hover:border-[#d31145]' : '')}
              `}>
                {isSelected && <i className="fas fa-check text-[9px] text-white"></i>}
              </div>
              <span className="font-bold text-base">{option}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCustomerCard = (customer: Customer, showButton: boolean = false) => {
    const activityName = MOCK_ACTIVITIES.find(a => a.id === customer.activityId)?.title || '未知活动';
    
    return (
      <div key={customer.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 group transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${showButton ? 'bg-slate-50 group-hover:bg-[#d31145]/5' : 'bg-[#d31145]/5'}`}>
              <i className={`${showButton ? 'fas fa-user-check' : 'fas fa-user'} ${showButton ? 'text-slate-400 group-hover:text-[#d31145]' : 'text-[#d31145]'}`}></i>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">{customer.name}</h4>
              <p className="text-sm text-slate-400 font-medium">{maskPhone(customer.phone)}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">{customer.companyName}</span>
        </div>
        
        <div className="h-px w-full bg-slate-50 mb-4"></div>
        
        <div className="flex items-end justify-between">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <i className="fas fa-clock text-[10px] text-slate-300"></i>
              <span className="text-[11px] text-slate-500 font-medium">WSM参与时间：</span>
              <span className="text-[11px] text-slate-700 font-bold">{customer.wsmTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-file-export text-[10px] text-slate-300"></i>
              <span className="text-[11px] text-slate-500 font-medium">问卷提交时间：</span>
              <span className="text-[11px] text-slate-700 font-bold">{customer.submissionTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-clipboard-list text-[10px] text-slate-300"></i>
              <span className="text-[11px] text-slate-500 font-medium">参与活动：</span>
              <span className="text-[11px] text-[#d31145] font-black">{activityName}</span>
            </div>
          </div>
          
          {showButton && (
            <button 
              onClick={() => handleViewSubmission(customer)}
              className="bg-slate-800 text-white text-[10px] font-black px-4 py-2.5 rounded-xl transition-all active:scale-95 hover:bg-slate-900 shadow-lg shrink-0 ml-4"
            >
              查看提交问卷
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {!isQuizMode && (
        <div className="h-40 shrink-0 bg-gradient-to-r from-[#d31145] to-[#f42b65] p-8 flex flex-col justify-end relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><i className="fas fa-building text-9xl text-white"></i></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white tracking-tight">
              {view === 'RECOMMENDED' && '职域面对面'}
              {view === 'PARTICIPATING' && '参与客户列表'}
              {view === 'ACTIVITY_SELECTION' && '选择活动列表'}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {view === 'RECOMMENDED' && '连接企业客户，挖掘业务深度'}
              {view === 'PARTICIPATING' && '管理已加入职域面对面的客户'}
              {view === 'ACTIVITY_SELECTION' && '请选择一个活动开始沟通'}
            </p>
          </div>
        </div>
      )}

      {view !== 'RECOMMENDED' && (
        <button 
          onClick={handleReturn}
          className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-[#d31145] transition-all z-30 active:scale-95 border border-slate-100"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      )}

      <div className={`flex-1 p-6 overflow-y-auto custom-scrollbar ${isQuizMode ? 'pt-2' : ''}`}>
        {view === 'ACTIVITY_SELECTION' && (
          <div className="grid grid-cols-3 gap-6 pb-24">
            {MOCK_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="relative h-32 overflow-hidden">
                  <img src={activity.cover} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={activity.title} />
                  <div className={`absolute inset-0 bg-gradient-to-t ${activity.color} opacity-20`}></div>
                  <div className="absolute top-3 left-3"><span className="bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-black text-[#d31145] shadow-sm">{activity.type}</span></div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-sm font-bold text-slate-800 mb-3 line-clamp-2 h-10">{activity.title}</h4>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-1.5"><i className="fas fa-file-lines text-slate-300 text-[10px]"></i><span className="text-[11px] font-bold text-slate-500">{activity.questionsCount}题</span></div>
                    <div className="flex items-center gap-1.5"><i className="fas fa-user-group text-slate-300 text-[10px]"></i><span className="text-[11px] font-bold text-slate-500">{activity.participants}参与</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button onClick={() => handleStartFill(activity, 'FILLING')} className="bg-[#d31145] text-white text-[11px] font-bold py-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#d31145]/20">填写</button>
                    <button onClick={() => handleStartFill(activity, 'PREVIEW')} className="bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-bold py-2 rounded-xl transition-all active:scale-95 hover:bg-slate-100">预览</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'PARTICIPATING' && (
          <>
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#d31145] rounded-full"></div>
                <h3 className="font-bold text-slate-800">参与客户列表</h3>
              </div>
            </div>
            <div className="space-y-4 pb-32">
              {MOCK_PARTICIPANTS.map((customer) => renderCustomerCard(customer, true))}
            </div>
          </>
        )}

        {(view === 'PREVIEW' || view === 'SUBMISSION_VIEW') && selectedActivity && (
          <div className="max-w-2xl mx-auto py-10 pb-32">
            <div className="bg-[#d31145]/5 rounded-3xl p-8 mb-8 border border-[#d31145]/10 mt-6 relative overflow-hidden">
               {view === 'SUBMISSION_VIEW' && (
                 <div className="absolute top-0 right-0 p-3">
                   <span className="text-[10px] font-black bg-[#d31145] text-white px-2 py-1 rounded-bl-xl uppercase tracking-tighter">已提交记录</span>
                 </div>
               )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#d31145] flex items-center justify-center text-white"><i className="fas fa-info"></i></div>
                <h3 className="text-xl font-black text-slate-800">
                  {view === 'SUBMISSION_VIEW' ? '问卷提交详情' : '问卷简介'}
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {selectedActivity.intro}
              </p>
            </div>
            {selectedActivity.questions.map((q, idx) => renderQuestionCard(q, idx, false))}
          </div>
        )}

        {view === 'FILLING' && selectedActivity && currentQuestion && (
          <div className="max-w-2xl mx-auto py-4 pb-32">
            {currentQIndex === 0 && (
              <div className="bg-[#d31145]/5 rounded-3xl p-8 mb-6 border border-[#d31145]/10 animate-in fade-in slide-in-from-top-4 duration-500 mt-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#d31145] flex items-center justify-center text-white"><i className="fas fa-info"></i></div>
                  <h3 className="text-xl font-black text-slate-800">问卷简介</h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">{selectedActivity.intro}</p>
              </div>
            )}

            <div className={`bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 animate-in fade-in zoom-in duration-300 ${currentQIndex > 0 ? 'mt-10' : ''}`}>
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-black text-[#d31145] tracking-widest uppercase">
                  {currentQuestion.type === 'SINGLE' ? '单选题' : '多选题'}
                </span>
                {currentQuestion.required && <span className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full text-[10px] font-bold">必填</span>}
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 mb-10 leading-snug">{currentQIndex + 1}. {currentQuestion.text}</h3>
              
              <div className="space-y-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = currentQuestion.type === 'SINGLE' 
                    ? answers[currentQuestion.id] === option
                    : ((answers[currentQuestion.id] as string[]) || []).includes(option);
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionToggle(currentQuestion.id, option, currentQuestion.type)}
                      className={`
                        w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group
                        ${isSelected 
                          ? 'border-[#d31145] bg-[#d31145]/5 text-[#d31145]' 
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}
                      `}
                    >
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                        ${isSelected ? 'bg-[#d31145] border-[#d31145]' : 'border-slate-300 bg-white group-hover:border-[#d31145]'}
                      `}>
                        {isSelected && <i className="fas fa-check text-[10px] text-white"></i>}
                      </div>
                      <span className="font-bold text-lg">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {view === 'RECOMMENDED' && (
          <>
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#d31145] rounded-full"></div>
                <h3 className="font-bold text-slate-800">推荐客户列表</h3>
              </div>
              <button onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#d31145] bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                <i className={`fas fa-sort-amount-${sortOrder === 'desc' ? 'down' : 'up'} text-[#d31145]`}></i>
                按问卷提交时间{sortOrder === 'desc' ? '倒序' : '正序'}
              </button>
            </div>
            <div className="space-y-4 pb-32">
              {sortedRecommended.map((customer) => renderCustomerCard(customer, false))}
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex gap-4 z-20">
        {view === 'RECOMMENDED' && (
          <>
            <button onClick={handleOpenModal} className="flex-1 bg-[#d31145] text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#d31145]/10 flex items-center justify-center gap-2 transition-all active:scale-95"><i className="fas fa-plus-circle"></i>发起职域面对面</button>
            <button onClick={() => setView('PARTICIPATING')} className="flex-1 bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"><i className="fas fa-users-viewfinder"></i>查看参与客户</button>
          </>
        )}
        
        {view === 'FILLING' && selectedActivity && (
          <div className="w-full bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-8 duration-500">
            {currentQIndex > 0 ? (
              <button 
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))} 
                className="px-8 py-4 rounded-2xl font-bold transition-all hover:bg-slate-100 text-slate-500 active:scale-95"
              >
                上一题
              </button>
            ) : <div className="px-8" />}
            
            {isLastQuestion ? (
              <button 
                onClick={handleSubmit} 
                disabled={!canProceed} 
                className={`flex-1 max-w-xs py-4 rounded-2xl font-black transition-all shadow-xl ${(!canProceed) ? 'bg-slate-200 text-slate-400' : 'bg-[#d31145] text-white active:scale-95 shadow-[#d31145]/20'}`}
              >
                提交问卷
              </button>
            ) : (
              <button 
                onClick={() => setCurrentQIndex(prev => prev + 1)} 
                disabled={!canProceed} 
                className={`flex-1 max-w-xs py-4 rounded-2xl font-black transition-all shadow-xl ${(!canProceed) ? 'bg-slate-200 text-slate-400' : 'bg-slate-800 text-white active:scale-95 shadow-slate-900/10'}`}
              >
                下一题
              </button>
            )}
            <div className="px-8" />
          </div>
        )}

        {view === 'PREVIEW' && selectedActivity && (
          <button onClick={() => handleStartFill(selectedActivity, 'FILLING')} className="w-full bg-[#d31145] text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-[#d31145]/20 flex items-center justify-center gap-3 transition-all active:scale-95">
            <i className="fas fa-pen-to-square"></i>填写此问卷
          </button>
        )}
      </div>

      {isSuccessModalOpen && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
              <i className="fas fa-check-circle text-6xl"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4">提交成功</h3>
            <p className="text-slate-500 mb-10 font-medium leading-relaxed">问卷内容已成功保存并提交系统处理。</p>
            <button onClick={closeAndReset} className="w-full bg-[#d31145] text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">确认返回</button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={handleCloseModal} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"><i className="fas fa-times text-sm"></i></button>
            <div className="text-center mt-4">
              <h3 className="text-xl font-black text-slate-800 mb-8">请使用微信扫一扫</h3>
              <div className="relative mx-auto w-56 h-56 bg-white p-4 rounded-3xl shadow-inner border border-slate-100 overflow-hidden">
                <SimulatedQRCode seed={qrSeed} status={qrStatus} />
                {(qrStatus !== 'pending') && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center animate-in fade-in duration-200">
                    {qrStatus === 'locked' && <div className="flex flex-col items-center"><div className="w-10 h-10 border-4 border-[#d31145] border-t-transparent rounded-full animate-spin mb-3"></div><span className="text-sm font-bold text-[#d31145]">客户校验中</span></div>}
                    {qrStatus === 'expired' && <div className="flex flex-col items-center"><i className="fas fa-circle-exclamation text-3xl text-slate-400 mb-2"></i><span className="text-sm font-bold text-slate-500 text-center px-4 leading-tight">二维码已失效<br/><span className="text-xs opacity-60">请点击下方按钮刷新</span></span></div>}
                    {qrStatus === 'success' && <div className="flex flex-col items-center"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-2"><i className="fas fa-check text-xl"></i></div><span className="text-sm font-bold text-green-600">校验成功</span></div>}
                  </div>
                )}
              </div>
              <div className="mt-8 h-12 flex items-center justify-center">
                {qrStatus === 'pending' && <div className="text-slate-400 font-medium text-sm"><span><span className="text-[#d31145] font-bold mx-1">{timeLeft}s</span>后二维码失效</span></div>}
                {qrStatus === 'expired' && <button onClick={generateNewQR} className="text-[#d31145] font-bold text-sm bg-[#d31145]/5 px-6 py-2 rounded-full transition-all active:scale-95"><i className="fas fa-arrows-rotate mr-2"></i>刷新二维码</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {isConfirmModalOpen && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl text-center animate-in slide-in-from-bottom-8 duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"><i className="fas fa-shield-check text-4xl"></i></div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">验证已通过</h3>
            <p className="text-slate-500 mb-10 leading-relaxed">请确认是否立即开始“面对面”活动。</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleAcceptConfirm} className="w-full bg-[#d31145] text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">确认</button>
              <button onClick={handleCancelConfirm} className="w-full text-slate-400 font-bold py-3 transition-colors hover:text-slate-600">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
