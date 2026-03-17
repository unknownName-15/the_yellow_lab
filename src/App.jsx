import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

// --- 애니메이션 및 물리 효과 설정 ---
const cursorSpring = { damping: 25, stiffness: 200 };
const transition = { type: 'spring', stiffness: 300, damping: 30 };

// 클릭 불꽃 파편 애니메이션
const particleVariants = {
  initial: { scale: 0, opacity: 1 },
  animate: (i) => ({
    x: Math.cos(i * (Math.PI / 4)) * 60, 
    y: Math.sin(i * (Math.PI / 4)) * 60,
    scale: [0, 1.5, 0],
    opacity: [1, 1, 0],
    transition: { duration: 0.6, ease: "easeOut" }
  })
};

// --- 스타일 설정 ---
const styles = {
  container: {
    fontFamily: '"Pretendard Variable", sans-serif',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    margin: 0,
    padding: 0,
    overflowX: 'hidden',
    minHeight: '100vh',
    cursor: 'none', // 기본 마우스 숨김
    position: 'relative',
  },
  cursor: {
    width: '20px', height: '20px', backgroundColor: '#FFD700', borderRadius: '50%',
    position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999, mixBlendMode: 'difference',
  },
  spotlight: {
    position: 'fixed', top: 0, left: 0, width: '700px', height: '700px',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.35) 0%, transparent 50%)',
    pointerEvents: 'none', zIndex: 0, transform: 'translate(-50%, -50%)',
  },
  particle: {
    position: 'absolute', width: '6px', height: '6px', backgroundColor: '#FFD700',
    borderRadius: '50%', pointerEvents: 'none',
  },
  section: {
    padding: '100px 20px', minHeight: '80vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    position: 'relative', zIndex: 1,
  },
  bigTitle: { 
    fontSize: 'clamp(60px, 15vw, 180px)', fontWeight: '950', lineHeight: '0.8', 
    letterSpacing: '-8px', margin: 0, paddingBottom: '20px',
    WebkitTextStroke: '2px #FFD700', color: 'transparent', // 테두리 효과
    transition: 'all 0.4s ease',
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2px', maxWidth: '1200px', width: '100%', backgroundColor: '#222',
  },
  cardBase: {
    backgroundColor: '#000', textAlign: 'center', position: 'relative', 
    overflow: 'hidden', display: 'flex', flexDirection: 'column', 
    alignItems: 'center', justifyContent: 'center',
  },
  compactCard: { minHeight: '350px', padding: '60px 40px' },
  expandedCard: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    zIndex: 1000, padding: '100px 20px', overflowY: 'auto', backgroundColor: '#000',
  },
};

const cardData = [
  { id: '1', title: 'INSIGHT', text: '새로운 시각을 발견하세요.', description: '아이디어가 탄생하는 첫 번째 단계입니다. 세상의 고정관념을 깨는 새로운 시각을 공유합니다.' },
  { id: '2', title: 'CONNECT', text: '파트너와 협업하세요.', description: '혼자서는 이룰 수 없는 꿈을 함께 만듭니다. 당신의 열정을 나눌 파트너를 이곳에서 만나세요.' },
  { id: '3', title: 'BUILD', text: '현실로 만들어보세요.', description: '생각에 그치지 않고 결과물을 만들어내는 단계입니다. 제작 환경과 리소스를 지원합니다.' }
];

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [clicks, setClicks] = useState([]);

  // 마우스 좌표 추적
  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);
  const springX = useSpring(cursorX, cursorSpring);
  const springY = useSpring(cursorY, cursorSpring);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  // 클릭 이벤트 (불꽃 효과)
  const handlePageClick = (e) => {
    const newClick = { id: Date.now(), x: e.clientX, y: e.clientY };
    setClicks((prev) => [...prev, newClick]);
    setTimeout(() => {
      setClicks((prev) => prev.filter((c) => c.id !== newClick.id));
    }, 800);
  };

  const selectedData = cardData.find(item => item.id === selectedId);

  return (
    <div style={styles.container} onClick={handlePageClick}>
      {/* 전등 효과 & 커서 */}
      <motion.div style={{ ...styles.spotlight, x: springX, y: springY }} />
      <motion.div style={{ ...styles.cursor, x: springX, y: springY, translateX: '-50%', translateY: '-50%' }} />

      {/* 클릭 불꽃 효과 */}
      <AnimatePresence>
        {clicks.map((click) => (
          <div key={click.id} style={{ position: 'absolute', left: click.x, top: click.y, pointerEvents: 'none', zIndex: 9998 }}>
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} custom={i} style={styles.particle} variants={particleVariants} initial="initial" animate="animate" />
            ))}
          </div>
        ))}
      </AnimatePresence>

      {/* Hero Section */}
      <section style={styles.section}>
        <motion.h1 
          style={styles.bigTitle}
          initial={{ opacity: 0, letterSpacing: '10px', filter: 'blur(10px)' }}
          animate={{ opacity: 1, letterSpacing: '-8px', filter: 'blur(0px)' }}
          whileHover={{ color: '#FFD700', scale: 1.02 }}
          transition={{ duration: 1 }}
        >
          YELLOW<br/>LAB.
        </motion.h1>
      </section>

      {/* Grid Section */}
      <section style={{ ...styles.section, padding: 0 }}>
        <div style={styles.grid}>
          {cardData.map((item, i) => (
            <motion.div 
              key={item.id}
              layoutId={item.id}
              style={{ ...styles.cardBase, ...styles.compactCard }}
              onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
              whileHover="hover"
              initial="rest"
            >
              <motion.div variants={{ rest: { opacity: 0, y: 20 }, hover: { opacity: 1, y: 0 } }} transition={{ duration: 0.3 }}>
                <h3 style={{ fontSize: '40px', color: '#FFD700', margin: '0 0 15px' }}>{item.title}</h3>
                <p style={{ color: '#AAA', fontSize: '16px' }}>{item.text}</p>
              </motion.div>
              <div style={{ position: 'absolute', bottom: '20px', right: '30px', fontSize: '100px', fontWeight: '900', color: '#111', zIndex: -1 }}>
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Expanded Card Animation */}
      <AnimatePresence>
        {selectedId && (
          <motion.div layoutId={selectedId} style={styles.expandedCard} transition={transition}>
            <motion.div 
              style={{ position: 'fixed', top: '40px', right: '40px', color: '#FFD700', fontSize: '30px', zIndex: 1001 }}
              onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
              whileHover={{ rotate: 90, scale: 1.2 }}
            >
              ✕
            </motion.div>
            <motion.div style={{ maxWidth: '800px', margin: '0 auto' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 style={{ fontSize: '80px', color: '#FFD700', fontWeight: '950', margin: '0 0 30px' }}>{selectedData?.title}</h2>
              <p style={{ color: '#FFF', fontSize: '20px', lineHeight: '1.8' }}>{selectedData?.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <section style={styles.section}>
        <motion.div whileHover={{ scale: 1.1 }} style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700', borderBottom: '2px solid #FFD700', paddingBottom: '5px' }}>
          JOIN THE SYNDICATE
        </motion.div>
      </section>
    </div>
  );
}

export default App;