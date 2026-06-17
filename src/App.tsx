/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Ticket, 
  Instagram, 
  TrendingUp, 
  Sparkle, 
  CheckCircle2, 
  ArrowRight, 
  Coffee, 
  Smartphone, 
  UploadCloud, 
  X, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  Heart,
  ChevronLeft
} from 'lucide-react';

// Custom types for our simulated dashboard
interface Customer {
  id: number;
  name: string;
  menu: string;
  lastVisit: number; // days ago
  dangerLevel: 'high' | 'medium' | 'low';
  messageDraft: string;
  couponDraft: string;
  instagramDraft: string;
}

export default function App() {
  // Navigation active tab (purely visual UX scroll helper)
  const [activeSection, setActiveSection] = useState<'home' | 'problem' | 'how-it-works' | 'features' | 'math' | 'apply'>('home');

  // Beta application modal
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Inline form state
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shopType, setShopType] = useState('cafe');
  const [notes, setNotes] = useState('');
  const [inlineIsSubmitting, setInlineIsSubmitting] = useState(false);
  const [inlineShowToast, setInlineShowToast] = useState(false);
  const [inlineError, setInlineError] = useState('');

  // Modal form state (독립 상태)
  const [modalShopName, setModalShopName] = useState('');
  const [modalOwnerName, setModalOwnerName] = useState('');
  const [modalPhoneNumber, setModalPhoneNumber] = useState('');
  const [modalShopType, setModalShopType] = useState('cafe');
  const [modalNotes, setModalNotes] = useState('');
  const [modalIsSubmitting, setModalIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const [honeypot, setHoneypot] = useState('');

  // Interactive Calculator State
  const [averageCheck, setAverageCheck] = useState(8500); // default average check per customer
  const [revisitTarget, setRevisitTarget] = useState(15); // average customer target per month

  // Interactive AI Simulator active customer
  const [selectedSimCustomer, setSelectedSimCustomer] = useState<number>(0);
  const [simCopied, setSimCopied] = useState(false);

  // Simulated Customers Data
  const mockCustomers: Customer[] = [
    {
      id: 0,
      name: "이지은 님 (지은 사장님 매장 단골)",
      menu: "아이스 바닐라 라떼 & 딸기 휘낭시에",
      lastVisit: 35,
      dangerLevel: "high",
      messageDraft: "지은님, 안녕하세요☕️ 소담베이커리 사장이에요. 요즘 바람이 선선한데 잘 지내시죠? 저번 방문에 지은님이 좋아하셨던 딸기 휘낭시에를 한가득 구웠는데 소식이 뜸하셔 생각나 연락드려요. 혹시 지나가시는 길 있으시면 편하게 들러주셔요. 소담베이커리가 준비한 '웰컴백 아메리카노 무료 쿠폰'도 함께 띄워 드립니다. 다시 뵙는 날을 기다릴게요! 늘 고맙습니다.",
      couponDraft: "🎁 지은님을 위한 웰컴백 무료 아메리카노 쿠폰 (소담베이커)",
      instagramDraft: "🍰 [라떼와 구움과자를 사랑해주시는 분들을 위한 웰컴백 이벤트]\n\n소담베이커리가 가끔씩 발길이 뜸해진 소중한 단골분들을 위해 작은 깜짝 선물을 준비했습니다. 최근 한 달간 소식이 뜸해 아쉬운 마음에, 평소 즐겨 찾으시던 디저트와 함께 곁들이기 좋은 커피 한 잔을 소담이 쏩니다!\n\n✔️ 참여 방법: 소담베이커리 카카오톡 플러스친구 추가 후 단골 인증 쿠폰 발부받기\n\n✔️ 소중한 인연이 오랫동안 머물다 갈 수 있는 골목 모퉁이 따뜻한 소담베이커리가 될게요. 오늘도 달콤한 하루 보내세요."
    },
    {
      id: 1,
      name: "김민혁 님 (매주 수요일 오시던 손님)",
      menu: "소금빵 3개 세트 & 콜드브루",
      lastVisit: 42,
      dangerLevel: "high",
      messageDraft: "민혁님, 안녕하세요! 골목 모퉁이 소담베이커리입니다🥐 요즘 매장 시그니처 소금빵이 정말 맛있게 구워지고 있는데, 수요일마다 뵙던 민혁님 얼굴이 안 보인지 벌써 한 달이 훌쩍 넘었네요. 갓 구운 달콤하고 고소한 소금빵 냄새를 맡을 때마다 민혁님 생각이 났답니다. 오랜만에 방문해주시면 반가운 마음으로 '시그니처 소금빵 1개 서비스 증정 쿠폰'을 드릴게요. 편하실 때 따뜻한 빵 냄새 가득한 매장으로 놀러오세요!",
      couponDraft: "🎁 민혁님 전용 갓 구운 소금빵 1개 서비스 쿠폰 (소담베이커리)",
      instagramDraft: "🥐 [골목에 퍼지는 소금빵 향기, 고마운 마음을 전합니다]\n\n안녕하세요, 소담베이커리입니다. 매일 아침 소량만 구워져 금방 매진되는 소금빵, 늘 기다려 주시던 정다운 얼굴들이 문득 그리워지는 따뜻한 오후네요.\n\n바쁜 소소한 일상 속에서 잠시 쉼표가 필요하실 때, 한 번 더 저희 매장의 고소한 우유 향을 채워가실 수 있도록 단골 복귀 웰컴 이벤트를 엽니다! 쿠폰을 받아 방문하시면 시그니처 소금빵을 따끈하게 데워 준비해 드릴게요."
    },
    {
      id: 2,
      name: "박서윤 님 (얼그레이 타르트 마니아)",
      menu: "얼그레이 타르트 & 밀크티",
      lastVisit: 28,
      dangerLevel: "medium",
      messageDraft: "서윤님 안녕하셔요! 소담베이커리 사장입니다😊 얼그레이 타르트를 유독 좋아해 주셔서 정성을 담아 크림을 올리던 기억이 선명하네요. 서윤님의 소중한 발걸음이 한 달 가까이 보이지 않아 이렇게 살짝 안부 메시지를 적어 보아요. 많이 바쁘시진 않으신지 걱정도 살짝 되고요. 서윤님을 위해 준비한 '디저트 메뉴 주문 시 밀크티 50% 할인 쿠폰'을 카카오톡으로 함께 전해드려요. 향긋한 시간 선물해 드릴 준비하고 있을게요!",
      couponDraft: "🎁 서윤님 전용 디저트 주문 시 밀크티 50% 할인 웰컴 쿠폰",
      instagramDraft: "🧁 [얼그레이를 사랑해주시는 소중한 그대에게]\n\n저희 매장의 얼그레이 크림은 유독 깊고 향긋하죠. 그 향기를 좋아해 매장을 한가득 채워주시던 우아한 고객분들이 떠오르는 계절입니다.\n\n잠시 걸음이 소원해지셨던 이웃 단골들께 작은 환대의 마음을 건넵니다. 단골쿠폰 링크를 누르고 오시면 타르트와 찰떡궁합인 따뜻한 밀크티를 절반 가격에 준비해 드리겠습니다. 편안한 발걸음으로 향기를 즐기러 오세요."
    }
  ];

  // Calculated revenue metrics
  const estimatedRecovery = averageCheck * revisitTarget * 12; // annualized
  const monthlyRecovery = averageCheck * revisitTarget;

  const submitToSheet = async (payload: Record<string, string>) => {
    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) throw new Error("VITE_GOOGLE_SCRIPT_URL 미설정");
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  };

  const validatePhone = (v: string) => /^010[-\s]?\d{3,4}[-\s]?\d{4}$/.test(v.trim());

  // 하단 인라인 폼 제출
  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setInlineError('');

    if (!shopName || !ownerName || !phoneNumber || !shopType) {
      setInlineError("필수 항목(가게 이름, 사장님 성함, 연락처, 업종)을 모두 입력해주세요.");
      return;
    }
    if (!validatePhone(phoneNumber)) {
      setInlineError("연락처는 010-XXXX-XXXX 형식으로 입력해주세요.");
      return;
    }

    setInlineIsSubmitting(true);
    try {
      await submitToSheet({ shopName, ownerName, phoneNumber, shopType, notes,
        submittedAt: new Date().toISOString(), source: "landing_page", website: honeypot });
      setShopName(''); setOwnerName(''); setPhoneNumber(''); setShopType('cafe'); setNotes('');
      setInlineShowToast(true);
      setTimeout(() => setInlineShowToast(false), 4500);
    } catch (err) {
      console.error("[Rebot] 인라인 폼 제출 오류:", err);
      setInlineError("제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setInlineIsSubmitting(false);
    }
  };

  // 모달 폼 제출
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setModalError('');

    if (!modalShopName || !modalOwnerName || !modalPhoneNumber || !modalShopType) {
      setModalError("필수 항목(가게 이름, 사장님 성함, 연락처, 업종)을 모두 입력해주세요.");
      return;
    }
    if (!validatePhone(modalPhoneNumber)) {
      setModalError("연락처는 010-XXXX-XXXX 형식으로 입력해주세요.");
      return;
    }

    setModalIsSubmitting(true);
    try {
      await submitToSheet({ shopName: modalShopName, ownerName: modalOwnerName,
        phoneNumber: modalPhoneNumber, shopType: modalShopType, notes: modalNotes,
        submittedAt: new Date().toISOString(), source: "landing_page", website: honeypot });
      setModalShopName(''); setModalOwnerName(''); setModalPhoneNumber('');
      setModalShopType('cafe'); setModalNotes(''); setModalError('');
      setShowApplyModal(false);
    } catch (err) {
      console.error("[Rebot] 모달 폼 제출 오류:", err);
      setModalError("제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setModalIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSimCopied(true);
    setTimeout(() => setSimCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#3E2723] selection:bg-[#FFE0B2] selection:text-[#3E2723] overflow-x-hidden animate-fade-in">
      
      {/* Dynamic Warm Banner (Sticky Announcement) */}
      <div className="w-full bg-[#FF8A65] px-4 py-2 text-center text-xs md:text-sm font-medium text-white flex items-center justify-center gap-2 relative z-40">
        <Sparkle className="w-4 h-4 animate-pulse fill-white/80 stroke-white/80" />
        <span>지금 신청하면 <strong>3개월 동안 이용료가 완전히 무료!</strong> (한정 수량 50팀 한정)</span>
        <button 
          onClick={() => {
            setModalShopName("소담베이커리");
            setModalOwnerName("김소담");
            setModalPhoneNumber("010-1234-5678");
            setModalShopType("bakery");
            setShowApplyModal(true);
          }}
          className="underline hover:text-amber-100 ml-2 font-bold focus:outline-none transition-colors cursor-pointer"
        >
          간편 신청하기 &rarr;
        </button>
      </div>

      {/* Styled Friendly Header Nav */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#E0D7C6] z-10 transition-all duration-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo with Soft organic design */}
          <a href="#" className="flex items-center gap-2.5 group focus:outline-none" id="nav-logo">
            <div className="w-9 h-9 rounded-xl bg-[#FF8A65] flex items-center justify-center text-white shadow-md shadow-[#FF8A65]/20 group-hover:scale-105 transition-all">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-serif-title text-xl font-bold tracking-tight text-[#5D4037] group-hover:text-[#FF8A65] transition-colors">리봇</span>
              <span className="text-[10px] font-mono tracking-widest text-[#FF8A65] font-bold block -mt-1 leading-none">REBOT</span>
            </div>
          </a>

          {/* Nav links for desktop - Friendly layout */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#8D6E63]">
            <a 
              href="#problem" 
              onClick={() => setActiveSection('problem')}
              className={`hover:text-[#3E2723] transition-colors ${activeSection === 'problem' ? 'text-[#3E2723] font-semibold' : ''}`}
            >
              우리의 고민
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setActiveSection('how-it-works')}
              className={`hover:text-[#3E2723] transition-colors ${activeSection === 'how-it-works' ? 'text-[#3E2723] font-semibold' : ''}`}
            >
              작동방식
            </a>
            <a 
              href="#features" 
              onClick={() => setActiveSection('features')}
              className={`hover:text-[#3E2723] transition-colors ${activeSection === 'features' ? 'text-[#3E2723] font-semibold' : ''}`}
            >
              핵심기능
            </a>
            <a 
              href="#math" 
              onClick={() => setActiveSection('math')}
              className={`hover:text-[#3E2723] transition-colors ${activeSection === 'math' ? 'text-[#3E2723] font-semibold' : ''}`}
            >
              단골의 가치
            </a>
          </nav>

          {/* Quick Header CTA button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-[#5D4037] text-white hover:bg-[#3E2723] text-sm font-semibold px-5 py-2 rounded-full transition-all focus:outline-none cursor-pointer"
              id="header-btn-trial"
            >
              3개월 무료 신청
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow">
        
        {/* SECTION 1: HERO (친근하고 따뜻하지만, 호소력 짙은 웰컴) */}
        <section className="relative pt-10 pb-20 md:py-28 px-4 md:px-6 overflow-hidden max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12" id="hero-section">
          
          {/* Hero Ambient Background circles */}
          <div className="absolute top-1/4 -left-12 w-64 h-64 bg-[#FFE0B2]/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FF8A65]/5 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Hero Left Content */}
          <div className="flex-1 space-y-7 text-center md:text-left">
            
            {/* Friendly Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#FFE0B2]/40 border border-[#E0D7C6]/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#3E2723]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A65] animate-ping"></span>
              <span>카페·디저트 가게 사장님을 위한 AI 소식보좌관</span>
            </div>

            {/* Core Headline */}
            <h1 className="font-serif-title leading-[1.25] text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#3E2723] tracking-tight">
              <span className="text-[#FF8A65] underline decoration-[#FFE0B2] decoration-8 underline-offset-4">30일째 안 온 단골,</span><br className="hidden sm:inline" />
              그냥 보내실 건가요?
            </h1>

            {/* Easy Subtitle */}
            <p className="text-[#5D4037] text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto md:mx-0">
              바쁜 하루살이 매장 일과에 지치셨죠? 30일째 방문을 멈춘 고마운 손님들, <strong className="font-semibold text-[#3E2723]">리봇 AI</strong>가 한눈에 찾아내어 마음을 따끈하게 녹일 맞춤 웰컴백 메시지와 쿠폰, SNS 포스트 초안을 알아서 뚝딱 준비해 드립니다.
            </p>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full sm:w-auto bg-[#FF8A65] text-white hover:bg-[#FF7043] font-bold px-8 py-4.5 rounded-2xl shadow-xl shadow-[#FF8A65]/15 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-2 group cursor-pointer"
                id="hero-cta-btn"
              >
                <span>베타 신청하기 (3개월 무료)</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="text-xs text-[#8D6E63] flex flex-col sm:items-start text-center">
                <span className="font-medium text-[#3E2723]">✍️ 1분 간편 신청</span>
                <span>설치 무관, 즉시 시작 혜택 제공</span>
              </div>
            </div>

            {/* Core Value points under CTA */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E0D7C6] max-w-md mx-auto md:mx-0 text-center">
              <div>
                <p className="text-xl md:text-2xl font-bold text-[#FF8A65] font-serif-title">3분</p>
                <p className="text-xs text-[#8D6E63] mt-1">간편 데이터 등록</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-[#FF8A65] font-serif-title">100%</p>
                <p className="text-xs text-[#8D6E63] mt-1">AI 맞춤 문안 자동화</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-[#FF8A65] font-serif-title">월 3만원</p>
                <p className="text-xs text-[#8D6E63] mt-1">합리적인 웰컴 마케팅</p>
              </div>
            </div>

          </div>

          {/* Hero Right Visual Element - Responsive Tablet mockup of "Rebot Simulator Dashboard" */}
          <div className="flex-1 w-full max-w-md lg:max-w-lg relative" id="hero-interactive-preview">
            
            <div className="relative bg-stone-900 rounded-3xl p-3 shadow-2xl border border-stone-800">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-900 rounded-full z-10 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-800"></span>
              </div>

              {/* Simulated UI Screen */}
              <div className="bg-[#FAF8F5] rounded-2xl p-4 md:p-5 text-[#3E2723] text-xs sm:text-sm shadow-inner min-h-[380px] flex flex-col justify-between">
                
                {/* Simulated Header */}
                <div className="border-b border-[#E0D7C6] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#FF8A65] text-base">🍞</span>
                    <div>
                      <h4 className="font-bold text-[#3E2723]">소담베이커리 매니저</h4>
                      <p className="text-[10px] text-stone-400">마지막 업데이트: 오늘 오전 9시</p>
                    </div>
                  </div>
                  <span className="bg-[#FFE0B2]/50 text-[#3E2723] text-[10px] font-bold px-2 py-0.5 rounded-full">AI 분석 활성화</span>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 gap-2 my-3">
                  <div className="bg-white p-2.5 rounded-xl border border-[#E0D7C6]/60 shadow-sm">
                    <span className="text-[#8D6E63] text-[10px] font-medium">이탈 우려 단골 손님</span>
                    <p className="text-base font-bold text-red-500 mt-0.5">28명 <span className="text-[10px] text-stone-500 font-normal">발견</span></p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#E0D7C6]/60 shadow-sm">
                    <span className="text-[#8D6E63] text-[10px] font-medium">이번 달 복귀 단골</span>
                    <p className="text-base font-bold text-emerald-600 mt-0.5">14명 <span className="text-[10px] text-stone-500 font-normal">복귀 완료!</span></p>
                  </div>
                </div>

                {/* Warning Alert Item mockup */}
                <div className="bg-orange-50/70 border border-orange-100 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                       <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                       <strong className="text-xs text-[#3E2723] font-bold">⚠️ 고위험 이탈 손님 감지</strong>
                     </div>
                     <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">마지막 방문 35일 전</span>
                  </div>
                  
                  <div className="text-[#5D4037] text-xs leading-relaxed">
                    <strong className="text-[#3E2723]">이지은 단골님</strong> (라떼 주문 1위) 방문 주기가 평소(7일)보다 너무 길어졌어요.
                  </div>

                  {/* AI Generated preview inside simulator card snippet */}
                  <div className="bg-white p-2.5 rounded-lg border border-orange-50 shadow-sm text-[11px] font-sans text-stone-750 mt-1">
                    <span className="text-[9px] text-[#FF8A65] font-bold block mb-1">🤖 AI 감성 안부 초안</span>
                    "지은님, 선선한 가을 소담베이커리입니다☕️ 혹시 바쁘신 일이 있으셨나요... 웰컴 소금빵 쿠폰을.."
                  </div>
                </div>

                {/* Button Mockup */}
                <div className="mt-3">
                  <button 
                    onClick={() => {
                      document.getElementById("interactive-mockup")?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-[#5D4037] hover:bg-[#3E2723] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>아래에서 AI 메시지 직접 편집해보기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

            {/* Small absolute badge hanging outside */}
            <div className="absolute -bottom-5 -right-5 md:-right-8 bg-white border border-[#E0D7C6] p-3.5 rounded-2xl shadow-xl flex items-center gap-3 max-w-[200px] z-10">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left leading-snug">
                <div className="text-[10px] text-[#8D6E63] font-medium">단골 수호 성공율</div>
                <div className="text-sm font-bold text-[#5D4037] font-serif-title">평균 24% 상승</div>
              </div>
            </div>

          </div>

        </section>

        {/* SECTION 2: PROBLEM EMPATHY (문제 공감 섹션: 단골이 떠나는 현실 vs 사장님이 손 쓸 길 없는 아픔) */}
        <section className="bg-[#FAF6F0] border-y border-[#E0D7C6] px-4 md:px-6 py-16 md:py-24" id="problem">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Header statement */}
            <div className="text-center space-y-3">
              <span className="text-sm font-bold text-[#FF8A65] uppercase tracking-wider block font-medium">소상공인 겪는 현실적인 문제</span>
              <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-[#3E2723] leading-snug">
                "매일 구워내는 빵과 내리는 커피는 맛만 좋은데...<br className="hidden sm:inline" />
                왜 손님들은 갈수록 조금씩 뜸해지는 걸까요?"
              </h2>
              <p className="text-[#8D6E63] max-w-xl mx-auto text-[15px] leading-relaxed">
                바쁘게 일하고 정신을 차려보면, 문득 마주하는 아쉬운 이탈의 현실. 그렇다고 사장님이 직접 종일 고객 명부를 들여다볼 손은 모자랍니다.
              </p>
            </div>

            {/* 2-Column Side-by-Side contrast cards block */}
            <div className="grid md:grid-cols-2 gap-8 items-stretch pt-4">
              
              {/* Left Column: The painful reality */}
              <div className="bg-white border border-[#E0D7C6] p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between opacity-95 relative shadow-sm">
                <div className="absolute top-4 right-4 text-3xl grayscale">🥀</div>
                
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-[#3E2723] flex items-center gap-2">
                    <span className="text-red-500">❌</span> 
                    <span>단골손님이 뜸해지는 가혹한 현실</span>
                  </h3>
                  <p className="text-[#8D6E63] text-sm leading-relaxed">
                    대기업 프랜차이즈나 대형 카페들은 비싼 전용 앱과 마케팅 팀을 써서 할인쿠폰과 알림톡을 가차없이 뿌리지만, 골목길의 우리 가게는 마땅한 도구조차 없습니다.
                  </p>
                  
                  {/* Detailed point cards */}
                  <ul className="space-y-3 pt-2">
                    <li className="flex items-start gap-2.5 text-[#5D4037] text-sm">
                      <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                      <span>손님이 20일째 안 오는지, 50일이 지났는지 머릿속으로는 도저히 하나하나 세어볼 수 없습니다.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[#5D4037] text-sm">
                      <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                      <span>먼저 연락을 넣으려 해도 "언제 한번 놀러오셔요"라는 말이 괜히 어색하고 홍보처럼 느껴져 쑥스럽습니다.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[#5D4037] text-sm">
                      <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                      <span>신메뉴가 나오거나 이벤트를 해도 인스타그램 구석에만 올려 소식을 아는 분들만 알고 지나칩니다.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#E0D7C6]/70 text-[#8D6E63] text-xs italic mt-4 text-center">
                  "일하느라 바쁜 사장님의 온 몸이 두 개 세 개일 수 없기에, 놓치기 아쉬운 단골손님들이 모르는 새 서서히 멀어집니다."
                </div>
              </div>

              {/* Right Column: Rebot cozy solution */}
              <div className="bg-[#FFFBF0] border border-[#FFE0B2] p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-md">
                <div className="absolute top-4 right-4 text-3xl font-bold text-[#FF8A65]">☀️</div>

                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-[#3E2723] flex items-center gap-2">
                    <span className="text-emerald-600">✨</span> 
                    <span>이제 리봇(Rebot)이 동반자가 됩니다</span>
                  </h3>
                  <p className="text-[#5D4037] text-sm leading-relaxed">
                    복잡한 설치나 어려운 프로그래밍도, 마케팅 전문용어도 필요 없습니다. 하루 단 3분, 리봇이 동네 단골들을 지킬 수 있도록 돕겠습니다.
                  </p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-start gap-2.5 text-[#3E2723] text-sm">
                      <span className="text-[#FF8A65] font-bold mt-0.5">&bull;</span>
                      <span><strong>AI 자동 고객 예측 감지 :</strong> POS 데이터에서 평소보다 방문 주기가 늦어지며 서서히 뜸해진 고객들을 AI가 바로 발굴해 리포트합니다.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[#3E2723] text-sm">
                      <span className="text-[#FF8A65] font-bold mt-0.5">&bull;</span>
                      <span><strong>동네 사장님의 입말처럼 따끈하게 :</strong> 딱딱한 광고사 카피 말고, 평소 사장님이 아침 인사를 건네듯 다정한 어투의 문안을 AI가 각 손님별 성향에 맞춰 작성합니다.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[#3E2723] text-sm">
                      <span className="text-[#FF8A65] font-bold mt-0.5">&bull;</span>
                      <span><strong>1초 복사 & 간편 톡 전송 :</strong> 사장님은 정성껏 준비된 카카오 메시지를 단지 '복사'해서 고객께 보내기만 하시면 됩니다.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-[#FFE0B2] text-[#3E2723] font-medium text-xs mt-4 text-center">
                  "리봇은 바쁜 사장님의 곁에서 하루종일 단골손님을 소중하게 응대할 스마트한 직원이자, 쉬운 CRM 보좌관 역할을 해줍니다."
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 3: HOW IT WORKS (작동방식 & 리얼 타임 인터랙티브 데모) */}
        <section className="bg-orange-50/10 border-y border-[#E0D7C6]/70 px-4 md:px-6 py-16 md:py-24" id="how-it-works">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Header block */}
            <div className="text-center space-y-3">
              <span className="text-sm font-bold text-[#FF8A65] uppercase tracking-wider block font-medium">안전하고 정직하게</span>
              <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-[#3E2723] leading-snug">
                어렵고 귀찮은 마케팅은 그만, 딱 4단계면 끝납니다
              </h2>
              <p className="text-[#8D6E63] max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                모든 과정은 복잡하고 어려운 설정 없이 마케팅의 기본을 충실히 채워 움직이도록 아주 단순하게 짜였습니다.
              </p>
            </div>

            {/* 4 Steps steps indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E0D7C6]/65 shadow-sm space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#FFE0B2] text-[#3E2723] font-bold flex items-center justify-center text-xs">01</div>
                <h4 className="font-bold text-sm text-[#3E2723]">하루 1회 엑셀등록</h4>
                <p className="text-xs text-[#8D6E63] leading-relaxed">POS 매출 내역을 마케팅 대시보드에 단 3초 만에 간편히 복사해 붙여넣습니다.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E0D7C6]/65 shadow-sm space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#FFE0B2] text-[#3E2723] font-bold flex items-center justify-center text-xs">02</div>
                <h4 className="font-bold text-sm text-[#3E2723]">이탈 단골 실시간 정밀탐지</h4>
                <p className="text-xs text-[#8D6E63] leading-relaxed">AI가 방문 주기가 급격히 늘어난 고위험 단골 손님 목록을 한눈에 식별해 냅니다.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E0D7C6]/65 shadow-sm space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#FFE0B2] text-[#3E2723] font-bold flex items-center justify-center text-xs">03</div>
                <h4 className="font-bold text-sm text-[#3E2723]">다정한 말투 맞춤문안 작문</h4>
                <p className="text-xs text-[#8D6E63] leading-relaxed">손님이 즐겨찾던 커피나 디저트 메뉴를 반영해, 딱딱하지 않고 정다운 말투의 원문을 AI가 작성합니다.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E0D7C6]/65 shadow-sm space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#FFE0B2] text-[#3E2723] font-bold flex items-center justify-center text-xs">04</div>
                <h4 className="font-bold text-sm text-[#3E2723]">1초 복사 & 다정 쿠폰 발송</h4>
                <p className="text-xs text-[#8D6E63] leading-relaxed">완성된 안부와 마음을 가득 담은 환대 쿠폰을 '복사' 한 번으로 간편하게 단골 분께 전송합니다.</p>
              </div>
            </div>

            {/* REAL PREVIEW & WORKSPACE SHOWCASE (대시보드와 고객 메시지 복사를 직접 경험해보세요!) */}
            <div className="bg-[#FFFBF0]/60 border border-[#FFE0B2] rounded-3xl p-6 md:p-10 space-y-8" id="interactive-mockup">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#E0D7C6]/60 pb-6">
                <div>
                  <span className="bg-[#FFE0B2] text-[#3E2723] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    🛠️ 인터랙티브 마케팅 시뮬레이터
                  </span>
                  <h3 className="font-serif-title text-2xl font-bold text-[#3E2723] mt-2">
                    만들어지는 마법을 먼저 직접 마주해 보세요!
                  </h3>
                  <p className="text-[#8D6E63] text-xs sm:text-sm mt-1">
                    아래에서 이탈 위험에 빠진 3명의 단골 손님 유형을 클릭하여 AI 메시지 초안을 실시간으로 확인해보세요.
                  </p>
                </div>

                {/* Customer selector (Tabs) */}
                <div className="flex flex-wrap gap-2">
                  {mockCustomers.map((cust, idx) => (
                    <button
                      key={cust.id}
                      onClick={() => {
                        setSelectedSimCustomer(idx);
                        setSimCopied(false);
                      }}
                      className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none cursor-pointer ${
                        selectedSimCustomer === idx 
                          ? 'bg-[#FF8A65] text-white shadow-md' 
                          : 'bg-white border border-[#E0D7C6] text-[#5D4037] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      👤 {cust.name.split(" ")[0]} 님 
                      <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedSimCustomer === idx ? 'bg-white/20 text-white' : 'bg-[#FFE0B2]/50 text-[#3E2723]'}`}>
                        {cust.lastVisit}일 안 오심
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row Layout of customer alert + Generated results */}
              <div className="grid md:grid-cols-12 gap-8 items-stretch">
                
                {/* Simulator Col 1: Customer Card */}
                <div className="md:col-span-5 bg-white border border-[#E0D7C6] rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center bg-[#FAF6F0] p-2.5 rounded-xl border border-[#E0D7C6]/60">
                      <span className="text-[11px] text-[#8D6E63] font-medium">대상 고객 이름</span>
                      <span className="text-[11px] font-bold text-[#3E2723] bg-white border border-[#E0D7C6] px-2 py-0.5 rounded-full">
                        {mockCustomers[selectedSimCustomer].name}
                      </span>
                    </div>

                    <div className="space-y-3.5 mt-4">
                      <div>
                        <span className="text-[11px] text-[#8D6E63] block font-medium">가장 좋아하는 최애 단골 메뉴</span>
                        <strong className="text-sm text-[#3E2723] flex items-center gap-1.5 mt-0.5">
                          <Coffee className="w-4.5 h-4.5 text-[#FF8A65] shrink-0" />
                          <span>{mockCustomers[selectedSimCustomer].menu}</span>
                        </strong>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <span className="text-[11px] text-[#8D6E63] block font-medium">이탈 판단 경과 시간</span>
                          <span className="text-sm font-bold text-red-500">
                            {mockCustomers[selectedSimCustomer].lastVisit}일째 무소식
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-[#8D6E63] block font-medium">AI 이탈 위험성 예측</span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#3E2723]">
                            <span className={`w-2.5 h-2.5 rounded-full ${mockCustomers[selectedSimCustomer].dangerLevel === 'high' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`}></span>
                            {mockCustomers[selectedSimCustomer].dangerLevel === 'high' ? '92% (고위험)' : '74% (주의)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#E0D7C6] pt-4 mt-4">
                    <div className="text-xs text-[#8D6E63] leading-normal flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#FF8A65] shrink-0 mt-0.5" />
                      <span>이 손님은 최근 3개월간 매주 거의 1회 방문하시던 분인데 최근 4주일이 지나도 오지 않고 계셔서 AI가 위험 요소를 경고하였습니다.</span>
                    </div>
                  </div>
                </div>

                {/* Simulator Col 2: The Generated Outputs (Tabs style within browser simulator) */}
                <div className="md:col-span-7 flex flex-col space-y-4">
                  
                  {/* Visual KakaoTalk / SNS output panel */}
                  <div className="bg-white border border-[#E0D7C6] rounded-2xl p-5 shadow-sm space-y-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-[#E0D7C6]/60 pb-3">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-5 h-5 text-[#FF8A65]" />
                          <h4 className="text-xs sm:text-sm font-bold text-[#3E2723]">
                            [AI 자동 완성 비서가 제안하는 솔루션]
                          </h4>
                        </div>
                        
                        <button
                          onClick={() => copyToClipboard(
                            `[문자안]\n${mockCustomers[selectedSimCustomer].messageDraft}\n\n[쿠폰혜택]\n${mockCustomers[selectedSimCustomer].couponDraft}`
                          )}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-bold flex items-center gap-1 cursor-pointer ${
                            simCopied 
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                              : 'bg-[#FDFBF7] border-[#E0D7C6] text-[#3E2723] hover:bg-[#FAF6F0]'
                          }`}
                        >
                          {simCopied ? "복사 완료! 👍" : "전체 문안 복사하기"}
                        </button>
                      </div>

                      {/* Kakao Bubble Style Content preview */}
                      <div className="space-y-4 mt-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-[11px] font-bold text-[#5D4037] block mb-1.5">💬 카카오 단골 안부 알림톡 초안</span>
                          <div className="bg-[#FAF6F0]/60 p-4 rounded-2xl border border-[#E0D7C6] relative max-w-lg leading-relaxed text-[#3E2723] font-sans whitespace-pre-wrap">
                            {mockCustomers[selectedSimCustomer].messageDraft}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <span className="text-[11px] font-bold text-[#5D4037] block mb-1.5">🎟️ AI 자동 탑재 고객 맞춤 쿠폰</span>
                            <div className="bg-[#FFFBF0] border-2 border-dashed border-[#FFE0B2] p-3 rounded-xl flex items-center justify-between">
                              <div className="leading-snug">
                                <span className="text-[10px] text-[#FF8A65] font-bold block">REBOT WELCOME BACK</span>
                                <strong className="text-[11px] sm:text-xs text-[#3E2723] font-bold">
                                  {mockCustomers[selectedSimCustomer].couponDraft.replace('🎁 ', '')}
                                </strong>
                              </div>
                              <span className="text-lg">🎟️</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold text-[#5D4037] block mb-1.5">📸 인스타/네이버 플레이스 포스트 초안</span>
                            <div className="bg-[#FDFBF7] border border-[#E0D7C6] p-3 rounded-xl text-[11px] text-[#5D4037] overflow-y-auto max-h-[75px] whitespace-pre-wrap leading-relaxed font-mono">
                              {mockCustomers[selectedSimCustomer].instagramDraft}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <span className="text-xs text-[#8D6E63]">
                        💁 사장님의 말투 선호도(다큐형, 친절형, 정겨운형)에 맞춰 이탈 복구 컨텐츠 발송율을 자유롭게 선택하세요.
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* SECTION 4: 4 CORE FEATURES (핵심 기능 카드 4개) */}
        <section className="bg-white/40 border-y border-[#E0D7C6] px-4 md:px-6 py-16 md:py-24" id="features">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Sec Heading */}
            <div className="text-center space-y-3">
              <span className="text-sm font-bold text-[#FF8A65] uppercase tracking-wider block font-medium">단골 수호의 완벽한 안전판</span>
              <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-[#3E2723] leading-snug">
                동네 카페의 일상에 꼭 맞는 4가지 핵심 무기
              </h2>
              <p className="text-[#8D6E63] max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                어려운 마케팅 대행사를 쓰지 않고도 대형 프랜차이즈가 지닌 똑똑한 단골 데이터 전략을 사장님 기기에 그대로 심었습니다.
              </p>
            </div>

            {/* Feature lists 4 Cards */}
            <div className="grid sm:grid-cols-2 gap-8">
              
              {/* Feature CARD 1 */}
              <div className="bg-white border border-[#E0D7C6] p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm hover:translate-y-[-2px] transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE0B2]/40 flex items-center justify-center text-[#FF8A65] shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-[#3E2723]">1. 이탈 위험 단골 고객 자동 감지</h3>
                  <p className="text-[#5D4037] text-sm leading-relaxed">
                    바쁜 사장님이 기억할 수 없는 수백 명의 손님 방문 기록을 똑똑히 기억합니다. 평소 일주일에 두 번 오던 고객이 30일째 발걸음을 멈추는 핵심 타이밍을 정확히 짚어 사장님께 속보를 전달합니다.
                  </p>
                </div>
              </div>

              {/* Feature CARD 2 */}
              <div className="bg-white border border-[#E0D7C6] p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm hover:translate-y-[-2px] transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE0B2]/40 flex items-center justify-center text-[#FF8A65] shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-[#3E2723]">2. 다정하고 정성 어린 AI 메시지 자동화</h3>
                  <p className="text-[#5D4037] text-sm leading-relaxed">
                    소중한 손님들에게 스팸성 광고로 찍히지 않도록, 동네 가게의 온도가 듬뿍 밴 섬세한 안부 편지를 씁니다. 손님이 자주 먹던 마들렌, 라떼, 스콘 등 기호 메뉴를 메시지 인사에 알아서 녹여 극적 안부를 묻습니다.
                  </p>
                </div>
              </div>

              {/* Feature CARD 3 */}
              <div className="bg-white border border-[#E0D7C6] p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm hover:translate-y-[-2px] transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE0B2]/40 flex items-center justify-center text-[#FF8A65] shrink-0">
                  <Ticket className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-[#3E2723]">3. 재방문 유도 웰컴백 맞춤 쿠폰</h3>
                  <p className="text-[#5D4037] text-sm leading-relaxed">
                    손님이 돌아올 명분을 만들어주는 웰컴 혜택을 설계합니다. '그냥 오세요' 대신 사장님의 소박한 마음(예: 고마운 마음을 담은 까눌레 조각 무료 증정 등)을 쿠폰으로 얹어 카카오 알림톡의 효율을 3배 이상 배가시킵니다.
                  </p>
                </div>
              </div>

              {/* Feature CARD 4 */}
              <div className="bg-white border border-[#E0D7C6] p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm hover:translate-y-[-2px] transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE0B2]/40 flex items-center justify-center text-[#FF8A65] shrink-0">
                  <Instagram className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-[#3E2723]">4. 인스타/플레이스 이벤트 포스트 생성</h3>
                  <p className="text-[#5D4037] text-sm leading-relaxed">
                    한 분에게 발송하는 안부를 넘어, 인스타그램이나 네이버 플레이스 새소식에 올릴 포스팅용 카피까지 그대로 완성해 드립니다. 사진 한 장과 이 자잘한 카피를 올려 '웰컴 안부 주간' 이벤트를 동네 손님들에게 널리 알릴 수 있습니다.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 5: TRUST & MATHEMATICAL VALUES (신뢰 섹션 & 매출 계산 플레이 슬라이더) */}
        <section className="px-4 md:px-6 py-16 md:py-24 max-w-4xl mx-auto space-y-12" id="math">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-sm font-bold text-[#FF8A65] uppercase tracking-wider block font-medium">단골의 압도적인 가치</span>
            <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-[#3E2723] leading-snug">
              "새로운 고객을 데려오는 광고보다,<br className="hidden sm:inline font-serif-title" />
              멀어진 단골의 발길을 돌리는 것이 <strong>5배 더 남는 장사</strong>입니다."
            </h2>
          </div>

          {/* Value comparison metrics display */}
          <div className="grid sm:grid-cols-3 gap-6 text-center pt-4">
            <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-amber-100">
              <span className="text-2xl">☕️</span>
              <h4 className="text-stone-500 text-xs mt-2">카페 매출의 원동력</h4>
              <p className="text-xl sm:text-2xl font-serif-title font-bold text-stone-900 mt-1">60 ~ 70%</p>
              <p className="text-stone-500 text-[11px] mt-1.5">가게 매출의 대부분은 3번 이상 재방문한 단골들에 의해 탄탄히 지탱됩니다.</p>
            </div>

            <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-amber-100">
              <span className="text-2xl">💰</span>
              <h4 className="text-stone-500 text-xs mt-2">신규 고객 획득 대비 비용</h4>
              <p className="text-xl sm:text-2xl font-serif-title font-bold text-stone-900 mt-1">5배 절약</p>
              <p className="text-stone-500 text-[11px] mt-1.5">새로운 얼굴 한 분께 노출하기 위한 인스타 전단지 비용보다 골목 단골 한 분의 귀환이 훨씬 빠르고 가치있습니다.</p>
            </div>

            <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-amber-100">
              <span className="text-2xl">📈</span>
              <h4 className="text-stone-500 text-xs mt-2">리봇 베타 단골 귀환율</h4>
              <p className="text-xl sm:text-2xl font-serif-title font-bold text-stone-900 mt-1">평균 24% 이상</p>
              <p className="text-stone-500 text-[11px] mt-1.5">위험 경고 발송 이후 30일 이내에 단골 손님 4명 중 1명꼴로 따뜻한 쿠폰을 쥐고 다시 인사를 하러 오십니다.</p>
            </div>
          </div>

          {/* DYNAMIC CALCULATOR SLIDER BLOCK (사장님이 직접 체험해볼 수 있는 매출 복귀 계산기) */}
          <div className="bg-stone-900 text-amber-50 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl relative overflow-hidden" id="interactive-revenue-calc">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF8A65]/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="border-b border-stone-800 pb-5">
              <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>💸 미련 없이 떠날 뻔한 우리 사장님 가게 단골 가치 계산기</span>
              </h3>
              <p className="text-stone-400 text-xs sm:text-sm mt-1">
                아래 슬라이더를 직접 마우스로 드래그하여 매장 매출의 기대 회복액을 지금 눈으로 확인해보세요.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center pt-2">
              
              <div className="space-y-6">
                
                {/* Slider 1: Number of Customers to pull back */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-stone-300 font-medium">한 달 동안 마음을 돌려 세울 단골 고객 수</span>
                    <span className="text-orange-400 font-bold text-base sm:text-lg">{revisitTarget}명</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    step="5"
                    value={revisitTarget} 
                    onChange={(e) => setRevisitTarget(Number(e.target.value))}
                    className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500">
                    <span>5명 (조소박)</span>
                    <span>50명 (보통)</span>
                    <span>100명 (활기 소담)</span>
                  </div>
                </div>

                {/* Slider 2: Average Check size */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-stone-300 font-medium">매장 고객 평균 주문 단가 (객단가)</span>
                    <span className="text-[#FF8A65] font-bold text-base sm:text-lg">
                      {averageCheck.toLocaleString()}원
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="4000" 
                    max="20000" 
                    step="500"
                    value={averageCheck} 
                    onChange={(e) => setAverageCheck(Number(e.target.value))}
                    className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500">
                    <span>4천원 (버블티/디저트)</span>
                    <span>1만원 (커피/케이크)</span>
                    <span>2만원 (홀 케이크/선물포장)</span>
                  </div>
                </div>

              </div>

              {/* Dynamic calculations outcomes visual card */}
              <div className="bg-stone-850 border border-stone-800 p-6 rounded-2xl space-y-4 text-center md:text-left shadow-lg">
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                  지켜낸 단골로 누적될 알짜배기 가치
                </span>
                
                <div>
                  <span className="text-xs text-stone-400 block">매달 복귀 단골 회복 매출액</span>
                  <strong className="text-2xl sm:text-3xl font-serif-title font-bold text-white">
                    + {monthlyRecovery.toLocaleString()}원 <span className="text-base font-normal text-stone-350">/ 월</span>
                  </strong>
                </div>

                <div className="border-t border-stone-800 pt-3">
                  <span className="text-xs text-stone-400 block">1년 동안 리봇으로 확보하는 총 매출 가치</span>
                  <strong className="text-3xl sm:text-4xl font-serif-title font-bold text-orange-500 block mt-1">
                    + {estimatedRecovery.toLocaleString()}원 <span className="text-lg font-normal text-amber-50">/ 년</span>
                  </strong>
                </div>

                <div className="p-3 bg-stone-900 rounded-xl border border-stone-800/80 text-left text-xs text-stone-400 leading-snug">
                  📌 리봇의 정식 가격은 <strong className="text-orange-400 text-xs">월 3만 원</strong>대입니다. 매달 마음이 떠나려던 이탈 단골 고객 중 <strong className="text-white">단 5~10명</strong>만 환대의 마음으로 지켜내도 이용료의 수십 배 부담을 즉시 덜어냅니다.
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* SECTION 6: BOTTOM FINAL CTA & BETA FORM (하단 신청서 연동) */}
        <section className="bg-[#5C4033] text-amber-50 px-4 md:px-6 py-20 relative overflow-hidden" id="apply">
          
          {/* Subtle decor for organic feel */}
          <div className="absolute top-1/2 -left-1/3 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/2 -right-1/3 w-96 h-96 bg-[#FF8A65]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left promo info */}
            <div className="md:col-span-5 space-y-6 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 bg-amber-100/10 border border-amber-100/20 px-3 py-1 rounded-full text-xs font-semibold text-orange-400">
                ⭐ 선착순 50개 매장 특별 웰컴 이벤트
              </span>
              <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
                지금 신청하시면 3개월 동안 비용 없이 단골 귀환을 도와드려요!
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                "매장에 연동하는 과정이 걱정되시나요?" 마케팅 담당자 리봇이 신청 즉시 개별 안심 연락을 드리고 사장님 매장 POS에 바로 맞춰 직접 친절하게 모든 세팅을 완료해 드립니다.
              </p>

              <div className="space-y-3.5 pt-2 hidden md:block">
                <div className="flex items-center gap-2.5 text-xs text-stone-200">
                  <CheckCircle2 className="w-5 h-5 text-[#FF8A65] shrink-0" />
                  <span>위약금 제로, 무약정 3개월 전면 무료체험</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-200">
                  <CheckCircle2 className="w-5 h-5 text-[#FF8A65] shrink-0" />
                  <span>사장님 말투 선호도 세밀 매칭 및 AI 코칭 특권</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-200">
                  <CheckCircle2 className="w-5 h-5 text-[#FF8A65] shrink-0" />
                  <span>개인 매장부터 소상공인 1인 사장님 누구나 신청 가능</span>
                </div>
              </div>
            </div>

            {/* Right direct embedded form */}
            <div className="md:col-span-7 bg-[#FAF8F5] text-stone-800 p-6 sm:p-8 rounded-3xl shadow-2xl border border-amber-100 relative">
              
              <div className="absolute top-4 right-4 bg-orange-100 text-orange-850 text-[10px] font-bold px-2 py-0.5 rounded-full">
                마감 임박 9자리 남음
              </div>

              <form onSubmit={handleInlineSubmit} className="space-y-4" id="beta-apply-form">
                  <div className="border-b border-amber-100 pb-3">
                    <h3 className="font-serif-title text-xl font-bold text-stone-900">
                      리봇(Rebot) 웰컴 베타체험 신청서
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      오늘 신청하고 3개월 전면 무료사용 및 프리미엄 서포트 혜택을 가져가세요.
                    </p>
                  </div>

                  {/* Form fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block">
                        가게 매장명 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="예) 온정 로스터리 카페"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 transition-all font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 block">
                        사장님 성함 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="예) 홍길동"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">
                      연락처 (안내 메시지 발송용) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="예) 010-1234-5678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">업종 카테고리</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'cafe', label: '카페 ☕️' },
                        { id: 'dessert', label: '디저트 🍩' },
                        { id: 'bakery', label: '베이커리 🥐' },
                        { id: 'other', label: '기타 매장' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setShopType(type.id)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            shopType === type.id
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-white border-amber-100 text-stone-700 hover:bg-amber-50/50'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">문의 기재 사항 & 요청메시지 (선택)</label>
                    <textarea
                      rows={2}
                      placeholder="설치 기종 편차나 건의하고 싶으신 점이 있으시면 자유롭게 남겨주세요."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 transition-all font-sans resize-none"
                    />
                  </div>

                  {/* 인라인 에러 메시지 */}
                  {inlineError && (
                    <p className="text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">{inlineError}</p>
                  )}

                  {/* Informational consent check */}
                  <div className="flex items-start gap-2 pt-1 text-[11px] text-stone-500 leading-normal">
                    <input type="checkbox" required className="mt-0.5 rounded border-amber-300 text-orange-600 focus:ring-orange-500" />
                    <span>개인정보 수집 및 베타 3개월 프로모션 가입을 희망하며 연락처를 제공하는 것에 동의합니다.</span>
                  </div>

                  {/* Honeypot: 봇 방지용 숨김 필드 */}
                  <div style={{position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden'}} aria-hidden="true">
                    <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>

                  <button
                    type="submit"
                    disabled={inlineIsSubmitting}
                    className="w-full bg-[#5C4033] hover:bg-[#4E3529] text-white py-4.5 rounded-2xl font-bold tracking-wide transition-all shadow-lg active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2 text-base cursor-pointer"
                    id="submit-beta-form-btn"
                  >
                    {inlineIsSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>신청서 전송 중...</span>
                      </>
                    ) : (
                      <>
                        <span>3개월 무료 체험 베타 신청서 제출하기</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

            </div>

          </div>
        </section>

      </main>

      {/* Styled Footnote */}
      <footer className="bg-stone-950 text-stone-400 py-12 px-4 md:px-6 border-t border-stone-900 text-center text-xs space-y-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white text-sm font-bold">
              R
            </div>
            <span className="font-serif-title text-base font-bold text-white tracking-widest">REBOT</span>
          </div>

          <div className="flex gap-4 text-stone-500">
            <a href="#" className="hover:text-stone-300">이용약관</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-stone-300">개인정보 처리방침</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-stone-300">소상공인 혜택 상세</a>
          </div>
        </div>

        <div className="text-stone-600 pt-6 border-t border-stone-900 text-[11px] max-w-4xl mx-auto space-y-1">
          <p>상호명: (주)리봇마케팅테크 | 대표: 홍단골 | 주소: 서울특별시 마포구 백범로 3층 카페살리기연구실</p>
          <p>본 서비스 of AI 메시지 생성 엔진은 대형 소상공인 POS 포맷 연동을 기반으로 안전하게 작동합니다.</p>
          <p>&copy; 2026 REBOT. All rights reserved. Designed for local warm bakeries and cafes with love 🍞</p>
        </div>
      </footer>

      {/* 성공 토스트 (4.5초 후 자동 사라짐) */}
      {inlineShowToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm w-[calc(100%-2rem)]">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium leading-snug">베타 신청이 접수되었습니다. 담당자가 입력하신 연락처로 3일 이내 연락드릴 예정입니다.</span>
        </div>
      )}

      {/* FIXED FLOATING POPUP DIALOG FOR BETA APPLY */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] text-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-amber-100 animate-in fade-in zoom-in-95">
            
            <button 
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-650 p-1 rounded-full focus:outline-none transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 hover:scale-105 transition-transform" />
            </button>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="border-b border-amber-100 pb-3">
                <span className="text-[10px] bg-orange-100 text-orange-900 px-2 py-0.5 rounded-full font-bold">3개월 이용료 무료 프로모션</span>
                <h3 className="font-serif-title text-xl font-bold text-stone-900 mt-2">
                  리봇(Rebot) 베타 신청하기
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  1분만 적어주시면 단골 지킴이 비서가 발맞춰 찾아갑니다.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">매장 상호명 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="예) 소담 커피 스페이스"
                  value={modalShopName}
                  onChange={(e) => setModalShopName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-amber-200 bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">사장님 성함 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="예) 김소담"
                  value={modalOwnerName}
                  onChange={(e) => setModalOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-amber-200 bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">연락처 <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  required
                  placeholder="예) 010-1234-5678"
                  value={modalPhoneNumber}
                  onChange={(e) => setModalPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-amber-200 bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">업종 유형</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'cafe', label: '디카 원두 카페 ☕️' },
                    { id: 'dessert', label: '구움과자 디저트 🍩' },
                    { id: 'bakery', label: '오븐 베이커리 🥐' },
                    { id: 'other', label: '기타 1인 매장 🏠' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setModalShopType(type.id)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        modalShopType === type.id
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white border-amber-100 text-stone-700 hover:bg-amber-50/50'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 모달 에러 메시지 */}
              {modalError && (
                <p className="text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">{modalError}</p>
              )}

              {/* Honeypot: 봇 방지용 숨김 필드 */}
              <div style={{position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden'}} aria-hidden="true">
                <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>

              <button
                type="submit"
                disabled={modalIsSubmitting}
                className="w-full bg-[#5C4033] hover:bg-[#4E3529] text-white py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-70 mt-2 flex items-center justify-center gap-1 cursor-pointer"
              >
                {modalIsSubmitting ? '신청 중입니다...' : '무료 체험판 든든하게 받기 ⭐'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
