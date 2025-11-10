// 모바일 최적화된 메인 JavaScript
let waitingCount = 1328;

// 감정 분석 및 텍스트 변환 함수
function analyzeText() {
    const textInput = document.getElementById('textInput');
    const resultDiv = document.getElementById('result');
    const text = textInput.value.trim();
    
    if (!text) {
        showToast('메시지를 입력해주세요!');
        return;
    }
    
    // 입력 필드 비우기 (모바일 UX)
    textInput.value = '';
    
    // 감정 분석
    const emotion = detectEmotion(text);
    
    // 텍스트에 감정 효과 적용
    applyEmotionEffect(resultDiv, text, emotion);
    
    // 폭파 버튼 표시
    showExplodeButton();
    
    // 햅틱 피드백 (모바일에서)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// 텍스트에 감정 효과 적용
function applyEmotionEffect(element, text, emotion) {
    element.innerHTML = '';
    
    const words = text.split(' ');
    const emotionKeywords = getEmotionKeywords(emotion);
    
    words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.marginRight = '0.3em';
        
        const isEmotionKeyword = emotionKeywords.some(keyword => 
            word.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (isEmotionKeyword) {
            applyWordEffect(wordSpan, word, emotion, true);
        } else {
            applyWordEffect(wordSpan, word, emotion, false);
        }
        
        element.appendChild(wordSpan);
    });
}

// 단어 효과 적용
function applyWordEffect(element, word, emotion, isEmotionKeyword) {
    const characters = word.split('');
    
    characters.forEach((char, charIndex) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.className = `char-emo ${emotion}`;
        
        if (isEmotionKeyword) {
            charSpan.classList.add('emotion-highlight');
            applyStrongEffect(charSpan, emotion, charIndex);
        } else {
            applyNormalEffect(charSpan, emotion, charIndex);
        }
        
        element.appendChild(charSpan);
    });
}

// 일반 효과 함수
function applyNormalEffect(element, emotion, index) {
    const styles = {
        animationDelay: `${(index * 0.15) % 1}s`,
        display: 'inline-block'
    };
    
    switch(emotion) {
        case 'happy':
            styles.transform = `translateY(${Math.sin(index) * -2}px)`;
            styles.color = '#feca57';
            break;
        case 'angry':
            styles.transform = `translateX(${Math.sin(index) * 1}px)`;
            styles.color = '#ff6b6b';
            break;
        case 'sad':
            styles.transform = `translateY(${Math.sin(index) * 1}px)`;
            styles.color = '#a29bfe';
            styles.opacity = '0.9';
            break;
        case 'excited':
            styles.transform = `scale(${1 + Math.sin(index) * 0.05})`;
            styles.color = '#48dbfb';
            break;
        case 'love':
            styles.transform = `scale(${1 + Math.sin(index) * 0.03})`;
            styles.color = '#ff9ff3';
            break;
        case 'irony':
            styles.transform = `rotate(${Math.sin(index) * 1}deg)`;
            styles.color = '#ff9f43';
            break;
        default:
            styles.color = '#54a0ff';
    }
    
    Object.assign(element.style, styles);
}

// 강한 효과 (감정 키워드)
function applyStrongEffect(element, emotion, index) {
    const styles = {
        animationDelay: `${(index * 0.1) % 1}s`,
        display: 'inline-block',
        fontWeight: '900'
    };
    
    switch(emotion) {
        case 'happy':
            styles.transform = `translateY(${Math.sin(index) * -4}px) rotate(${Math.cos(index) * 3}deg)`;
            styles.fontSize = '1.2em';
            styles.color = '#ffd32a';
            styles.textShadow = '0 0 10px rgba(255, 211, 42, 0.7)';
            break;
        case 'angry':
            styles.transform = `translateX(${Math.sin(index) * 3}px) rotate(${Math.random() * 4 - 2}deg)`;
            styles.fontSize = '1.3em';
            styles.color = '#ff3838';
            styles.textShadow = '0 0 8px rgba(255, 56, 56, 0.6)';
            break;
        case 'sad':
            styles.transform = `translateY(${index * 0.4}px) scale(${0.9 - (index * 0.01)})`;
            styles.fontSize = `${1.0 - (index * 0.03)}em`;
            styles.color = '#6c5ce7';
            styles.opacity = `${0.8 - (index * 0.04)}`;
            styles.filter = `blur(${index * 0.08}px)`;
            styles.fontStyle = 'italic';
            break;
        case 'excited':
            styles.transform = `scale(${1 + Math.sin(index) * 0.15})`;
            styles.fontSize = '1.25em';
            styles.color = '#18dcff';
            styles.textShadow = '0 0 12px rgba(24, 220, 255, 0.8)';
            break;
        case 'love':
            styles.transform = `scale(${1 + Math.sin(index) * 0.1})`;
            styles.fontSize = '1.2em';
            styles.color = '#ff9ff3';
            styles.textShadow = '0 0 10px rgba(255, 159, 243, 0.7)';
            break;
        case 'irony':
            styles.transform = `rotate(${Math.sin(index) * 8}deg) scale(1.1)`;
            styles.fontSize = '1.2em';
            styles.color = '#ff9f43';
            styles.textShadow = '0 0 8px rgba(255, 159, 67, 0.6)';
            styles.fontStyle = 'italic';
            break;
    }
    
    Object.assign(element.style, styles);
}

// 감정 분석 함수
function detectEmotion(text) {
    const emotionPatterns = {
        'happy': ['기뻐', '행복', '좋아', '사랑', '최고', '대박', '와우', '기쁘', '신나', 'ㅋㅋ', 'ㅎㅎ', '하하', '웃기', '웃겨', '즐거', '좋다', '재미', '재밌'],
        'angry': ['화나', '짜증', '분노', '화남', '속상', '힘들어', '싫어', '화내', '열받', '빡쳐', '짜쳐', '화난다', '답답', '속터져', '화', '분노'],
        'sad': ['슬퍼', '우울', '눈물', '속상', '외로워', '힘들어', '아프', '서러워', '허전', 'ㅠㅠ', 'ㅜㅜ', '슬픔', '우울해', '눈물나', '마음아파', '쓸쓸해', '허탈'],
        'excited': ['신나', '기대', '재미', '멋지', '놀라운', '대단', '와우', '대박', '짱', '흥분', '신기', '놀라워', '엄청나', '굉장해', '흥미'],
        'love': ['사랑', '좋아해', '애정', '매력', '귀여워', '예뻐', '멋져', '꽃길', '행복해', '사랑해', '매력적', '아름다워', '설렌다']
    };
    
    const ironyPatterns = [
        /(와|우와)\.?\s*(이거|진짜)\s*(정말|진짜)\s*(웃기|재미)/,
        /(진짜)\s*(대박|좋다|훌륭해|감동)/,
        /(정말)\s*(감동|좋네|기뻐)/,
        /(참\s*좋다|참\s*잘됐다)/
    ];
    
    text = text.toLowerCase().replace(/\s+/g, ' ');
    
    for (const pattern of ironyPatterns) {
        if (pattern.test(text)) {
            return 'irony';
        }
    }
    
    let detectedEmotion = 'neutral';
    let maxMatches = 0;
    
    for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
        const matches = patterns.filter(pattern => text.includes(pattern)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            detectedEmotion = emotion;
        }
    }
    
    return detectedEmotion;
}

// 감정별 키워드
function getEmotionKeywords(emotion) {
    const keywordMap = {
        'happy': ['기뻐', '행복', '좋아', '사랑', '최고', '대박', '신나', 'ㅋㅋ', 'ㅎㅎ', '웃기', '웃겨', '즐거', '재미', '재밌'],
        'angry': ['화나', '짜증', '분노', '화남', '속상', '싫어', '열받', '빡쳐', '짜쳐', '답답', '속터져'],
        'sad': ['슬퍼', '우울', '눈물', '외로워', '아프', '서러워', 'ㅠㅠ', 'ㅜㅜ', '슬픔', '쓸쓸해', '허탈', '슬프'],
        'excited': ['신나', '기대', '재미', '멋지', '대단', '대박', '짱', '흥분', '신기', '엄청나'],
        'love': ['사랑', '좋아해', '애정', '귀여워', '예뻐', '멋져', '사랑해', '설렌다'],
        'irony': ['웃기', '대박', '좋다', '감동', '훌륭해', '대단하다', '잘됐다']
    };
    
    return keywordMap[emotion] || [];
}

// 폭파 버튼 표시
function showExplodeButton() {
    const resultSection = document.querySelector('.result-section');
    
    const existingButton = document.querySelector('.btn-explode');
    if (existingButton) {
        existingButton.remove();
    }
    
    const explodeButton = document.createElement('button');
    explodeButton.className = 'btn-explode';
    explodeButton.innerHTML = '💥 메시지 폭파하기';
    explodeButton.onclick = explodeMessage;
    
    resultSection.appendChild(explodeButton);
}

// 메시지 폭파 효과
function explodeMessage() {
    const resultDiv = document.getElementById('result');
    const characters = resultDiv.querySelectorAll('.char-emo');
    
    characters.forEach((char, index) => {
        char.style.animation = `explode 0.8s forwards`;
        char.style.animationDelay = `${index * 0.05}s`;
        
        setTimeout(() => {
            char.style.opacity = '0';
        }, index * 50 + 500);
    });
    
    setTimeout(() => {
        resultDiv.innerHTML = '여기에 결과가 나타납니다';
        
        const explodeButton = document.querySelector('.btn-explode');
        if (explodeButton) {
            explodeButton.remove();
        }
        
        // 햅틱 피드백
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }, characters.length * 50 + 1000);
}

// 예시 텍스트 채우기
function fillExample(text) {
    document.getElementById('textInput').value = text;
    analyzeText();
}

// 실시간 데모
function initLiveDemo() {
    const liveDemo = document.getElementById('liveDemo');
    const demos = [
        { text: '오늘 기분 진짜 좋아 ㅋㅋㅋ', emotion: 'happy' },
        { text: '와 이거 정말 웃겨 대박이네', emotion: 'irony' },
        { text: '너무 화나서 참을 수 없어', emotion: 'angry' },
        { text: '슬프다... 눈물이 나', emotion: 'sad' },
        { text: '신난다! 기대된다!', emotion: 'excited' },
        { text: '사랑해 너무 좋아', emotion: 'love' }
    ];
    
    let currentDemo = 0;
    
    function updateDemo() {
        const demo = demos[currentDemo];
        liveDemo.innerHTML = '';
        applyEmotionEffect(liveDemo, demo.text, demo.emotion);
        
        currentDemo = (currentDemo + 1) % demos.length;
    }
    
    // 3초마다 데모 변경
    setInterval(updateDemo, 3000);
    updateDemo();
}

// 토스트 메시지 표시
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// 섹션 스크롤
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// 공유 기능
function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: '이모톡 - 감정이 살아나는 메시지',
            text: '문자가 살아 움직이는 신기한 경험!',
            url: window.location.href
        });
    } else {
        copyLink();
    }
}

// 링크 복사
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('링크가 복사되었습니다!');
    });
}

// 카카오톡 공유 (간단한 버전)
function shareKakao() {
    showToast('카카오톡 공유 기능은 앱에서 사용 가능합니다');
}

// 이메일 제출
function submitEmail() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('이메일을 입력해주세요!');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('올바른 이메일 주소를 입력해주세요');
        return;
    }
    
    // 여기에 실제 이메일 제출 로직 구현
    showToast('알림 신청이 완료되었습니다!');
    emailInput.value = '';
    
    // 대기자 수 증가
    waitingCount++;
    document.getElementById('waitingCount').textContent = waitingCount.toLocaleString();
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 개인정보처리방침
function showPrivacy() {
    alert('개인정보처리방침 페이지 준비 중입니다.');
}

// 알림 요청
function requestNotify() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('출시 시 알림을 받으실 수 있습니다!');
            }
        });
    } else {
        showToast('알림 기능을 지원하지 않는 브라우저입니다');
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', function() {
    initLiveDemo();
    document.getElementById('waitingCount').textContent = waitingCount.toLocaleString();
    
    // 엔터 키로 분석 실행
    document.getElementById('textInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analyzeText();
        }
    });
});