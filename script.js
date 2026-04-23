document.addEventListener('DOMContentLoaded', () => {
    
    // Core Configuration Constants
    const STORAGE_KEY = 'olymris_whitelist_v3';
    const MASTER_SEED_WALLET = '0xa0fc544e44a0cdfcd7c314f650f63329fb574a00';
    const OFFICIAL_WALLET_KEY = 'olymris_official_wallet_v1';
    const DEFAULT_OFFICIAL_WALLET = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

    function getOfficialWallet() {
        return localStorage.getItem(OFFICIAL_WALLET_KEY) || DEFAULT_OFFICIAL_WALLET;
    }
    
    // --- 1. Custom Cursor & Follower ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX - 20) * 0.1;
        followerY += (mouseY - followerY - 20) * 0.1;
        
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .pillar, .constant-item, .cta-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.style.transform += ' scale(2)';
            follower.style.opacity = '0.1';
            cursor.style.transform += ' scale(0.5)';
        });
        el.addEventListener('mouseleave', () => {
            follower.style.opacity = '0.3';
            cursor.style.transform = cursor.style.transform.replace(' scale(0.5)', '');
        });
    });

    // --- 2. Cinematic Loader ---
    const loader = document.querySelector('.loader');
    const loaderSpans = document.querySelectorAll('.loader-logo span');

    // Staggered letter reveal in loader
    setTimeout(() => {
        loaderSpans.forEach((span, i) => {
            setTimeout(() => {
                span.style.transform = 'translateY(0)';
            }, i * 100);
        });
    }, 500);

    // Hide loader
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2000);
    });

    // --- 3. Scroll Progress & Theme Switching ---
    const progressBar = document.querySelector('.scroll-progress');
    const themeTrigger = document.querySelector('.theme-transition-trigger');

    window.addEventListener('scroll', () => {
        // Progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";

        // Theme switching (Threshold based)
        if (themeTrigger && !isAdminAuthenticated) {
            const triggerRect = themeTrigger.getBoundingClientRect();
            if (triggerRect.top < window.innerHeight / 2) {
                document.body.classList.add('theme-light');
                document.body.classList.remove('theme-dark');
            } else {
                document.body.classList.add('theme-dark');
                document.body.classList.remove('theme-light');
            }
        }

        updateParallax();
    });

    // --- 4. Intersection Observer for Reveals ---
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    function updateParallax() {
        const winScroll = window.pageYOffset;
        const viewportHeight = window.innerHeight;

        document.querySelectorAll('section').forEach(section => {
            const img = section.querySelector('.bg-media img');
            if (!img) return;

            const speed = 0.15;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Calculate how far the section is from the center of the viewport
            const scrollMiddle = winScroll + (viewportHeight / 2);
            const sectionMiddle = sectionTop + (sectionHeight / 2);
            const distanceFromCenter = scrollMiddle - sectionMiddle;
            
            // Apply transformation without lag
            img.style.transform = `scale(1.15) translateY(${distanceFromCenter * speed}px)`;
        });
    }

    // Initialize parallax immediately
    updateParallax();
    // Also initialize after a short delay to ensure layout is settled
    window.addEventListener('load', updateParallax);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a staggered title, animate children
                if (entry.target.classList.contains('stagger-title')) {
                    const text = entry.target.innerText;
                    entry.target.innerHTML = text.split('').map((char, i) => 
                        `<span style="transition-delay: ${i * 0.05}s">${char}</span>`
                    ).join('');
                    
                    setTimeout(() => {
                        entry.target.classList.add('stagger-reveal');
                        entry.target.classList.add('active');
                    }, 10);
                }
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 5. Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- 6. Language Switcher Logic ---
    const translations = {
        'en': {
            'nav_genesis': 'Genesis', 'nav_dual_core': 'Dual Core', 'nav_ecosystem': 'Ecosystem', 'nav_the_loop': 'The Loop',
            'hero_subtitle': 'A Value Circulation System<br>Built on Human Needs', 'const_attention': 'Attention', 'const_experience': 'Experience', 'const_health': 'Health', 'const_life': 'Life',
            'hero_body': 'A new structure of value is quietly taking shape. It does not rely on products, nor on temporary trends. It is built on something that does not fade — human needs.',
            'hero_cta': 'Explore Origin', 'shift_title': 'Value Is Shifting', 'shift_label_1': 'Shift 01', 'shift_val_1a': 'production', 'shift_val_1b': 'demand', 'shift_label_2': 'Shift 02', 'shift_val_2a': 'ownership', 'shift_val_2b': 'participation',
            'core_title': 'Value Is No Longer Created.<br><span class="emphasis">It Is Activated.</span>', 'core_body': 'Every entry. Every moment of attention. Every interaction. Activates value. Not extracted, not manufactured — but triggered through participation.',
            'pillar_1_title': 'Consciousness', 'pillar_1_sub': 'Attention. Emotion. Experience.', 'pillar_1_emp': 'Expanded here.', 'pillar_1_body': 'AI-driven content, immersive games, and social interaction generate continuous engagement frequency.',
            'pillar_2_title': 'Vitality', 'pillar_2_sub': 'Health. The body. Real existence.', 'pillar_2_emp': 'Anchored here.', 'pillar_2_body': 'Agriculture, nutrition, and physical well-being bring value back into the tangible world.',
            'flow_title': 'A System in Motion', 'flow_body': 'The OLYMRIS ecosystem is a living organism where value flows through stages of activation and grounding.',
            'flow_label_1': 'Step 01', 'flow_val_1': 'Assets Enter', 'flow_label_2': 'Step 02', 'flow_val_2': 'Value Grounded',
            'loop_title': 'No End. Only Circulation.', 'loop_item_1': 'Demand Emerges', 'loop_item_2': 'Participation Begins', 'loop_item_3': 'Value Flows', 'loop_item_4': 'Consumption Completes', 'loop_item_5': 'Renewal',
            'closing_title': 'It Is Already Happening', 'closing_body': 'Not a projection. Not a concept. But a structure already in motion, quietly expanding and gradually opening to the world.',
            'entry_title': 'This Is Early', 'entry_body_1': 'Every system has a starting point. A moment before it becomes obvious.', 'entry_body_2': 'This is that moment.', 'entry_cta': 'Join the Genesis',
            'nav_whitelist': 'Whitelist',
            'modal_step1_title': 'Node Whitelist', 'modal_step1_body': 'Enter your BSC (BEP-20) wallet address to begin onboarding.', 'modal_next': 'Continue',
            'modal_step2_title': 'Select Tier', 'modal_step2_body': 'Choose your participation level. Stablecoin & Platform Token ratio will be applied.',
            'modal_step3_title': 'Finalize', 'modal_step3_body': 'Send the selected amount to the official BSC address below.', 'modal_copy': 'Copy Address', 'modal_payment_note': 'Once confirmed, your account will be activated within 24 hours.', 'modal_finish': 'I Have Paid',
            'modal_referrer_label': 'REFERRER WALLET (REQUIRED)', 'err_invalid_referrer': 'Invalid Referrer Address. Referrer must be an approved node holder.',
            'nav_portal': 'Node Portal', 'portal_title': 'Node Portal', 'portal_desc': 'Enter your wallet address to view your node status and allocations.', 'portal_view_btn': 'View My Node', 'portal_status_active': 'Node Active', 'portal_status_pending': 'Verification Pending', 'portal_label_tier': 'Participation Tier', 'portal_label_ausd': 'AUSD Balance', 'portal_label_olym': 'OLYM Allocation', 'portal_exit': 'Exit Portal', 'portal_pending_msg': 'Verification is currently in progress. Your allocations will appear here once approved.',
            'tier_3k_label': '+ Standard Allocation', 'tier_5k_label': '+ Enhanced Quota', 'tier_10k_label': '+ Genesis Priority',
            'portal_buy_again': 'Add Node / Upgrade'
        },
        'zh-hk': {
            'nav_genesis': '創世', 'nav_dual_core': '雙核心', 'nav_ecosystem': '生態系統', 'nav_the_loop': '循環',
            'hero_subtitle': '建立在人類需求之上的<br>價值循環系統', 'const_attention': '注意力', 'const_experience': '體驗', 'const_health': '健康', 'const_life': '生命',
            'hero_body': '一種新的價值結構正在悄然形成。它不依賴於產品，也不依賴於暫時的趨勢。它建立在永不褪色的東西之上——人類的需求。',
            'hero_cta': '探索起源', 'shift_title': '價值正在轉移', 'shift_label_1': '轉變 01', 'shift_val_1a': '生產', 'shift_val_1b': '需求', 'shift_label_2': '轉變 02', 'shift_val_2a': '所有權', 'shift_val_2b': '參與',
            'core_title': '價值不再是被創造的。<br><span class="emphasis">它是被啟用的。</span>', 'core_body': '每一次進入。每一刻的關注。每一次互動。都在啟用價值。不是提取，不是製造——而是通過參與觸發。',
            'pillar_1_title': '意識', 'pillar_1_sub': '注意力。情感。體驗。', 'pillar_1_emp': '在此擴展。', 'pillar_1_body': 'AI驅動的內容、沉浸式遊戲和社交互動產生持續的參與頻率。',
            'pillar_2_title': '生命力', 'pillar_2_sub': '健康。身體。真實存在。', 'pillar_2_emp': '在此錨定。', 'pillar_2_body': '農業、營養和身體健康將價值帶回現實世界。',
            'flow_title': '運作中的系統', 'flow_body': 'OLYMRIS 生態系統是一個生命體，價值在啟用和落地階段之間流動。',
            'flow_label_1': '步驟 01', 'flow_val_1': '資產進入', 'flow_label_2': '步驟 02', 'flow_val_2': '價值落地',
            'loop_title': '沒有終點。只有循環。', 'loop_item_1': '需求浮現', 'loop_item_2': '參與開始', 'loop_item_3': '價值流動', 'loop_item_4': '消費完成', 'loop_item_5': '更新',
            'closing_title': '這已經在發生', 'closing_body': '不是預測。不是概念。而是一個已經在運作的結構，悄然擴張並逐漸向世界開放。',
            'entry_title': '大幕初啟', 'entry_body_1': '每個系統都有一個起點。在它變得顯而易見之前的一個時刻。', 'entry_body_2': '就是現在。', 'entry_cta': '加入創始',
            'nav_whitelist': '白名單',
            'modal_step1_title': '節點白名單', 'modal_step1_body': '輸入您的 BSC (BEP-20) 錢包地址以開始入駐。', 'modal_next': '繼續',
            'modal_step2_title': '選擇等級', 'modal_step2_body': '選擇您的參與級別。將應用穩定通证和平台通证比例。',
            'modal_step3_title': '完成', 'modal_step3_body': '將所選金額發送到下方的官方 BSC 地址。', 'modal_copy': '複製地址', 'modal_payment_note': '一旦確認，您的帳戶將在 24 小時內激活。', 'modal_finish': '我已支付',
            'modal_referrer_label': '推薦人錢包地址（必填）', 'err_invalid_referrer': '無效的推薦人地址。推薦人必須是已獲得批准的節點持有者。',
            'nav_portal': '節點門戶', 'portal_title': '節點門戶', 'portal_desc': '輸入您的錢包地址以查看您的節點狀態和配額。', 'portal_view_btn': '查看我的節點', 'portal_status_active': '節點已激活', 'portal_status_pending': '審核中', 'portal_label_tier': '參與等級', 'portal_label_ausd': 'AUSD 餘額', 'portal_label_olym': 'OLYM 配額', 'portal_exit': '退出門戶', 'portal_pending_msg': '審核正在進行中。批准後，您的配額將顯示在此處。',
            'tier_3k_label': '+ 標準配額', 'tier_5k_label': '+ 增強配額', 'tier_10k_label': '+ 創世優先級',
            'portal_buy_again': '增購 / 升級節點'
        },
        'jp': {
            'nav_genesis': 'ジェネシス', 'nav_dual_core': 'デュアルコア', 'nav_ecosystem': 'エコシステム', 'nav_the_loop': 'ループ',
            'hero_subtitle': '人間のニーズに基づいた<br>価値循環システム', 'const_attention': 'アテンション', 'const_experience': '体験', 'const_health': '健康', 'const_life': '生命',
            'hero_body': '新しい価値の構造が静かに形作られています。それは製品や一時的なトレンドに依存しません。それは色あせることのないもの、つまり人間のニーズの上に築かれています。',
            'hero_cta': '起源を探る', 'shift_title': '価値はシフトしている', 'shift_label_1': 'シフト 01', 'shift_val_1a': '生産', 'shift_val_1b': '需要', 'shift_label_2': 'シフト 02', 'shift_val_2a': '所有', 'shift_val_2b': '参加',
            'core_title': '価値はもはや創造されるものではない。<br><span class="emphasis">活性化されるものだ。</span>', 'core_body': 'すべてのエントリー。すべてのアテンション。すべてのインタラクション。それが価値を活性化します。搾取されるのでもなく、製造されるのでもなく、参加によって引き起こされるのです。',
            'pillar_1_title': '意識', 'pillar_1_sub': 'アテンション。感情。体験。', 'pillar_1_emp': 'ここで拡張。', 'pillar_1_body': 'AI駆動のコンテンツ、没入型ゲーム、ソーシャルインタラクションが継続的なエンゲージメントを生み出します。',
            'pillar_2_title': '生命力', 'pillar_2_sub': '健康。身体。真の実在。', 'pillar_2_emp': 'ここに定着。', 'pillar_2_body': '農業、栄養、そして身体的な幸福が、価値を具体的な世界へと連れ戻します。',
            'flow_title': '動き続けるシステム', 'flow_body': 'OLYMRIS エコシステムは、価値が活性化と定着の段階を経て流れる生命体です。',
            'flow_label_1': 'ステップ 01', 'flow_val_1': 'アセットの投入', 'flow_label_2': 'ステップ 02', 'flow_val_2': '価値の定着',
            'loop_title': '終わりはない。循環があるだけ。', 'loop_item_1': '需要の発生', 'loop_item_2': '参加の開始', 'loop_item_3': '価値の流動', 'loop_item_4': '消費の完了', 'loop_item_5': '再生',
            'closing_title': 'それはすでに起こっている', 'closing_body': '予測ではない。コンセプトでもない。すでに動き出している構造であり、静かに拡大し、徐々に世界へと開かれています。',
            'entry_title': 'まだ始まったばかり', 'entry_body_1': 'すべてのシステムには起点があります。それが当たり前になる前の瞬間。', 'entry_body_2': 'それが今です。', 'entry_cta': 'ジェネシスに参加する',
            'nav_whitelist': 'ホワイトリスト',
            'modal_step1_title': 'ノードホワイトリスト', 'modal_step1_body': 'BSC (BEP-20) ウォレットアドレスを入力してオンボーディングを開始します。', 'modal_next': '次へ',
            'modal_step2_title': 'ティアを選択', 'modal_step2_body': '参加レベルを選択してください。ステーブルコインとプラットフォームトークンの比率が適用されます。',
            'modal_step3_title': '完了', 'modal_step3_body': '選択した金額を以下の公式 BSC アドレスに送信してください。', 'modal_copy': 'アドレスをコピー', 'modal_payment_note': '確認後、24時間以内にアカウントが有効化されます。', 'modal_finish': '支払い完了',
            'nav_portal': 'ノードポータル', 'portal_title': 'ノードポータル', 'portal_desc': 'ウォレットアドレスを入力して、ノードのステータスと割り当てを確認してください。', 'portal_view_btn': 'マイノードを表示', 'portal_status_active': 'ノードアクティブ', 'portal_status_pending': '確認中', 'portal_label_tier': '参加ティア', 'portal_label_ausd': 'AUSD残高', 'portal_label_olym': 'OLYM配分', 'portal_exit': 'ポータルを終了', 'portal_pending_msg': '現在、確認作業を行っております。承認後、割り当てがここに表示されます。',
            'tier_3k_label': '+ 標準配分', 'tier_5k_label': '+ 強化配分', 'tier_10k_label': '+ ジェネシス優先権',
            'portal_buy_again': 'ノード増設 / アップグレード'
        },
        'kr': {
            'nav_genesis': '제네시스', 'nav_dual_core': '듀얼 코어', 'nav_ecosystem': '에코시스템', 'nav_the_loop': '루프',
            'hero_subtitle': '인간의 필요에 기반한<br>가치 순환 시스템', 'const_attention': '관심', 'const_experience': '경험', 'const_health': '건강', 'const_life': '생명',
            'hero_body': '새로운 가치 구조가 조용히 형성되고 있습니다. 그것은 제품이나 일시적인 트렌드에 의존하지 않습니다. 그것은 변치 않는 것, 즉 인간의 필요 위에 세워졌습니다.',
            'hero_cta': '기원 탐구', 'shift_title': '가치는 변화하고 있다', 'shift_label_1': '변화 01', 'shift_val_1a': '생산', 'shift_val_1b': '수요', 'shift_label_2': '변화 02', 'shift_val_2a': '소유', 'shift_val_2b': '참여',
            'core_title': '가치는 더 이상 창조되지 않는다.<br><span class="emphasis">활성화될 뿐이다.</span>', 'core_body': '모든 진입. 모든 관심의 순간. 모든 상호작용. 이것이 가치를 활성화합니다. 추출되거나 제조되는 것이 아니라 참여를 통해 유발되는 것입니다.',
            'pillar_1_title': '의식', 'pillar_1_sub': '관심. 감정. 경험.', 'pillar_1_emp': '여기서 확장.', 'pillar_1_body': 'AI 기반 콘텐츠, 몰입형 게임 및 소셜 상호작용이 지속적인 참여 빈도를 생성합니다.',
            'pillar_2_title': '생명력', 'pillar_2_sub': '건강. 신체. 실제 존재.', 'pillar_2_emp': '여기서 고정.', 'pillar_2_body': '농업, 영양 및 신체적 웰빙은 가치를 유형의 세계로 다시 가져옵니다.',
            'flow_title': '움직이는 시스템', 'flow_body': 'OLYMRIS 에코시스템은 가치가 활성화와 정착의 단계를 거쳐 흐르는 살아있는 유기체입니다.',
            'flow_label_1': '단계 01', 'flow_val_1': '자산 유입', 'flow_label_2': '단계 02', 'flow_val_2': '가치 정착',
            'loop_title': '끝은 없다. 순환만이 있을 뿐.', 'loop_item_1': '수요 발생', 'loop_item_2': '참여 시작', 'loop_item_3': '가치 흐름', 'loop_item_4': '소비 완료', 'loop_item_5': '갱신',
            'closing_title': '이미 일어나고 있다', 'closing_body': '예측이 아닙니다. 컨셉도 아닙니다. 이미 움직이고 있는 구조이며, 조용히 확장되고 서서히 세상에 열리고 있습니다.',
            'entry_title': '아직 초기 단계입니다', 'entry_body_1': '모든 시스템에는 시작점이 있습니다. 그것이 분명해지기 전의 순간.', 'entry_body_2': '지금이 바로 그 순간입니다.', 'entry_cta': '제네시스에 참여하세요',
            'nav_whitelist': '화이트리스트',
            'modal_step1_title': '노드 화이트리스트', 'modal_step1_body': 'BSC (BEP-20) 지갑 주소를 입력하여 온보딩을 시작하십시오.', 'modal_next': '다음',
            'modal_step2_title': '티어 선택', 'modal_step2_body': '참여 수준을 선택하십시오. 스테이블코인 및 플랫폼 토큰 비율이 적용됩니다.',
            'modal_step3_title': '마무리', 'modal_step3_body': '선택한 금액을 아래의 공식 BSC 주소로 보내십시오.', 'modal_copy': '주소 복사', 'modal_payment_note': '확인되면 24시간 이내에 계정이 활성화됩니다.', 'modal_finish': '결제 완료',
            'nav_portal': '노드 포탈', 'portal_title': '노드 포탈', 'portal_desc': '지갑 주소를 입력하여 노드 상태 및 할당량을 확인하십시오.', 'portal_view_btn': '내 노드 보기', 'portal_status_active': '노드 활성화됨', 'portal_status_pending': '확인 중', 'portal_label_tier': '참여 티어', 'portal_label_ausd': 'AUSD 잔액', 'portal_label_olym': 'OLYM 할당량', 'portal_exit': '포탈 종료', 'portal_pending_msg': '현재 확인이 진행 중입니다. 승인되면 할당량이 여기에 표시됩니다.',
            'tier_3k_label': '+ 표준 할당', 'tier_5k_label': '+ 강화 쿼터', 'tier_10k_label': '+ 제네시스 우선권',
            'portal_buy_again': '노드 증설 / 업그레이드'
        }
    };

    const langItems = document.querySelectorAll('.lang-item');
    
    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
    }

    langItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = item.getAttribute('data-lang');
            
            // Update all lang switchers (desktop and mobile)
            langItems.forEach(li => {
                if (li.getAttribute('data-lang') === selectedLang) {
                    li.classList.add('active');
                } else {
                    li.classList.remove('active');
                }
            });

            updateLanguage(selectedLang);
            console.log(`Language switched to: ${selectedLang}`);
        });
    });

    // --- 7. Whitelist Modal Logic ---
    const whitelistModal = document.getElementById('whitelist-modal');
    const whitelistBtns = [document.getElementById('whitelist-btn'), document.getElementById('mobile-whitelist-btn')];
    const modalClose = document.querySelector('.modal-close');
    const nextBtns = document.querySelectorAll('.next-step');
    const finishBtn = document.querySelector('.finish-step');
    const tierCards = document.querySelectorAll('.tier-card');
    const copyBtn = document.querySelector('.copy-btn');
    const paymentAddr = document.getElementById('payment-addr');

    let currentStep = 1;

    function openModal() {
        whitelistModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        currentStep = 1;
        showStep(1);
    }

    function closeModal() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = 'auto';
    }

    function showStep(step) {
        document.querySelectorAll('.modal-step').forEach(el => el.classList.remove('active'));
        document.getElementById(`step-${step}`).classList.add('active');
        currentStep = step;

        // If entering payment step, update the official wallet address
        if (step === 3) {
            const paymentAddrElem = document.getElementById('payment-addr');
            if (paymentAddrElem) {
                paymentAddrElem.innerText = getOfficialWallet();
            }
        }
    }

    whitelistBtns.forEach(btn => btn?.addEventListener('click', openModal));
    document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeModal));
    
    whitelistModal.addEventListener('click', (e) => {
        if (e.target === whitelistModal) closeModal();
    });

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStepEl = btn.closest('.modal-step');
            
            if (currentStepEl.id === 'step-1') {
                const wallet = document.getElementById('whitelist-wallet').value.trim();
                const referrer = document.getElementById('whitelist-referrer').value.trim();
                if (!wallet || !referrer) return alert("Please fill in both wallet and referrer.");
                if (wallet.toLowerCase() === referrer.toLowerCase()) return alert("You cannot refer yourself.");
                
                // Validate Referrer exists and is Approved using the sync-safe function
                const data = getWhitelistData();
                const isReferrerValid = data.some(item => item.wallet.toLowerCase() === referrer.toLowerCase() && item.status === 'Approved');
                
                if (!isReferrerValid) {
                    return alert(translations[currentLang]['err_invalid_referrer'] || "Invalid Referrer Address.");
                }
            }

            if (currentStep < 3) showStep(currentStep + 1);
        });
    });

    const tierGrid = document.querySelector('.tier-grid');
    tierGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.tier-card');
        if (card) {
            document.querySelectorAll('.tier-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        }
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(paymentAddr.innerText).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = "Copied!";
            setTimeout(() => copyBtn.innerText = originalText, 2000);
        });
    });

    finishBtn.addEventListener('click', () => {
        const wallet = document.getElementById('whitelist-wallet').value.trim();
        const referrer = document.getElementById('whitelist-referrer').value.trim();
        const tierCard = document.querySelector('.tier-card.active');
        
        if (!wallet || !tierCard) {
            alert("Please provide valid information.");
            return;
        }

        const tier = tierCard.getAttribute('data-tier');
        
        // Save to LocalStorage
        const submission = {
            wallet: wallet,
            referrer: referrer,
            tier: tier,
            timestamp: new Date().toLocaleString(),
            status: "Verification Pending"
        };
        
        let allSubmissions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        allSubmissions.push(submission);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allSubmissions));

        alert("Submission received. Our team will verify the transaction on the BSC network. Your account will be activated within 24 hours.");
        closeModal();
    });

    // --- 8. Admin Dashboard Logic ---
    const adminSection = document.getElementById('admin-section');
    const adminTbody = document.getElementById('admin-tbody');
    const clearBtn = document.getElementById('clear-data');
    const adminSearch = document.getElementById('admin-search');
    const exportBtn = document.getElementById('export-md');

    function getWhitelistData() {
        let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        
        // Ensure the current MASTER_SEED_WALLET is ALWAYS in the data and Approved
        const masterIndex = data.findIndex(item => item.wallet.toLowerCase() === MASTER_SEED_WALLET.toLowerCase());
        
        if (masterIndex === -1) {
            // Master not found, add it to the top
            const masterNode = {
                wallet: MASTER_SEED_WALLET,
                referrer: "N/A",
                tier: "10000",
                status: "Approved",
                timestamp: "GENESIS"
            };
            data.unshift(masterNode);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
            // Ensure the master node is always approved and has the correct address casing
            if (data[masterIndex].status !== 'Approved') {
                data[masterIndex].status = 'Approved';
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }
        }
        return data;
    }

    function renderAdminTable(filter = '') {
        const data = getWhitelistData();
        const filteredData = data.filter(item => 
            item.wallet.toLowerCase().includes(filter.toLowerCase())
        );

        adminTbody.innerHTML = filteredData.map((item, index) => {
            // Find actual index in master data to keep actions working
            const originalIndex = data.indexOf(item);
            const isMaster = item.wallet === MASTER_SEED_WALLET;
            return `
                <tr>
                    <td>${item.timestamp}</td>
                    <td style="font-family: monospace;">${item.wallet}</td>
                    <td style="font-family: monospace; opacity: 0.6;">${item.referrer || 'N/A'}</td>
                    <td>${item.tier} USDT</td>
                    <td>
                        <span class="status-pill" style="cursor: pointer; background: ${item.status === 'Approved' ? 'rgba(0,255,100,0.1)' : 'transparent'}; border-color: ${item.status === 'Approved' ? '#0f6' : 'rgba(255,255,255,0.2)'}; color: ${item.status === 'Approved' ? '#0f6' : '#fff'};" onclick="${isMaster ? '' : `window.toggleAdminStatus(${originalIndex})`}">
                            ${item.status}
                        </span>
                    </td>
                    <td>
                        ${isMaster ? '<span style="opacity:0.2; font-size:0.6rem;">LOCKED</span>' : `<button style="background: none; border: 1px solid rgba(255,0,0,0.3); color: #ff4444; font-size: 0.6rem; padding: 0.3rem 0.6rem; cursor: pointer; border-radius: 2px;" onclick="window.deleteAdminRecord(${originalIndex})">Delete</button>`}
                    </td>
                </tr>
            `;
        }).join('');
    }

    adminSearch?.addEventListener('input', (e) => {
        renderAdminTable(e.target.value);
    });

    document.getElementById('admin-logout')?.addEventListener('click', () => {
        isAdminAuthenticated = false;
        adminSection.style.display = 'none';
        window.location.hash = '';
        location.reload(); // Refresh to clean state
    });

    exportBtn?.addEventListener('click', () => {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (data.length === 0) return alert("No data to export.");

        let md = "# Olymris Node Whitelist Records\n\n";
        md += "| Timestamp | Wallet Address | Referrer | Tier | Status |\n";
        md += "| :--- | :--- | :--- | :--- | :--- |\n";
        
        data.forEach(item => {
            md += `| ${item.timestamp} | \`${item.wallet}\` | \`${item.referrer || 'N/A'}\` | ${item.tier} USDT | ${item.status} |\n`;
        });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `olymris_nodes_${new Date().toISOString().split('T')[0]}.md`;
        a.click();
        URL.revokeObjectURL(url);
    });

    window.toggleAdminStatus = (index) => {
        let data = getWhitelistData();
        if (data[index].wallet === MASTER_SEED_WALLET) return; // Protect Master
        data[index].status = data[index].status === 'Approved' ? 'Verification Pending' : 'Approved';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        renderAdminTable();
    };

    window.deleteAdminRecord = (index) => {
        let data = getWhitelistData();
        if (data[index].wallet === MASTER_SEED_WALLET) return; // Protect Master
        if (confirm("Are you sure you want to delete this record?")) {
            data.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            renderAdminTable();
        }
    };

    let isAdminAuthenticated = false;

    const adminLoginSection = document.getElementById('admin-login-section');
    const adminPassInput = document.getElementById('admin-pass-input');
    const adminAuthBtn = document.getElementById('admin-auth-btn');

    function checkAdminHash() {
        if (window.location.hash === '#admin') {
            if (!isAdminAuthenticated) {
                adminLoginSection.style.display = 'flex';
                adminSection.style.display = 'none';
                document.querySelectorAll('section:not(#admin-section):not(#admin-login-section)').forEach(s => s.style.display = 'none');
            } else {
                showAdminDashboard();
            }
        } else {
            hideAdminDashboard();
        }
    }

    function showAdminDashboard() {
        adminLoginSection.style.display = 'none';
        adminSection.style.display = 'block';
        document.body.classList.add('theme-dark');
        document.body.classList.remove('theme-light');
        document.querySelectorAll('section:not(#admin-section)').forEach(s => s.style.display = 'none');
        initAdminPaymentUI();
        renderAdminTable();
    }

    function hideAdminDashboard() {
        adminLoginSection.style.display = 'none';
        adminSection.style.display = 'none';
        document.querySelectorAll('section:not(.admin-dashboard):not(#admin-login-section)').forEach(s => s.style.display = 'block');
    }

    adminAuthBtn?.addEventListener('click', () => {
        if (adminPassInput.value === '132132') {
            isAdminAuthenticated = true;
            showAdminDashboard();
        } else {
            alert("Unauthorized Access.");
            adminPassInput.value = '';
        }
    });

    adminPassInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') adminAuthBtn.click();
    });

    window.addEventListener('hashchange', checkAdminHash);
    window.addEventListener('load', checkAdminHash);
    checkAdminHash();

    // --- 8b. Official Payment Management ---
    const officialWalletInput = document.getElementById('official-wallet-input');
    const saveOfficialWalletBtn = document.getElementById('save-official-wallet');

    function initAdminPaymentUI() {
        if (officialWalletInput) {
            officialWalletInput.value = getOfficialWallet();
        }
    }

    saveOfficialWalletBtn?.addEventListener('click', () => {
        const newAddr = officialWalletInput.value.trim();
        if (newAddr.length < 20) return alert("Please enter a valid wallet address.");
        localStorage.setItem(OFFICIAL_WALLET_KEY, newAddr);
        alert("Official System Address Updated Successfully!");
    });

    clearBtn.addEventListener('click', () => {
        if (confirm("Clear all whitelist records?")) {
            localStorage.removeItem(STORAGE_KEY);
            renderAdminTable();
        }
    });

    // --- 9. Node Portal Logic ---
    const portalModal = document.getElementById('portal-modal');
    const portalBtn = document.getElementById('portal-btn');
    const portalCheckBtn = document.getElementById('portal-check-btn');
    const portalWalletInput = document.getElementById('portal-wallet');
    const portalLogin = document.getElementById('portal-login');
    const portalView = document.getElementById('portal-view');

    const rewardMap = {
        '3000': { ausd: '3,000', olym: '9,000' },
        '5000': { ausd: '5,000', olym: '25,000' },
        '10000': { ausd: '10,000', olym: '100,000' }
    };

    const portalBtns = [document.getElementById('portal-btn'), document.getElementById('mobile-portal-btn')];
    
    portalBtns.forEach(btn => {
        btn?.addEventListener('click', () => {
            portalModal.classList.add('active');
            portalLogin.style.display = 'block';
            portalView.style.display = 'none';
            // Close mobile menu if open
            document.querySelector('.mobile-menu').classList.remove('active');
            document.querySelector('.menu-toggle').classList.remove('active');
        });
    });

    portalCheckBtn?.addEventListener('click', () => {
        const wallet = portalWalletInput.value.trim().toLowerCase();
        if (!wallet) return alert("Please enter your wallet address.");

        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const userRecords = data.filter(item => item.wallet.toLowerCase() === wallet);

        if (userRecords.length > 0) {
            portalLogin.style.display = 'none';
            portalView.style.display = 'block';
            
            const approvedRecords = userRecords.filter(r => r.status === 'Approved');
            const pendingRecords = userRecords.filter(r => r.status !== 'Approved');

            let totalTier = 0;
            let totalAUSD = 0;
            let totalOLYM = 0;

            approvedRecords.forEach(r => {
                totalTier += parseInt(r.tier);
                const rewards = rewardMap[r.tier];
                totalAUSD += parseInt(rewards.ausd.replace(/,/g, ''));
                totalOLYM += parseInt(rewards.olym.replace(/,/g, ''));
            });

            document.getElementById('val-tier').innerText = `${totalTier.toLocaleString()} USDT`;
            document.getElementById('val-ausd').innerText = totalAUSD.toLocaleString();
            document.getElementById('val-olym').innerText = totalOLYM.toLocaleString();
            
            if (approvedRecords.length > 0) {
                document.getElementById('portal-status-title').innerText = "Node Active";
                document.getElementById('portal-status-title').style.color = "#0f6";
            } else {
                document.getElementById('portal-status-title').innerText = "Verification Pending";
                document.getElementById('portal-status-title').style.color = "#ffaa00";
            }

            const pendingMsg = document.getElementById('portal-pending-msg');
            if (pendingRecords.length > 0) {
                pendingMsg.innerText = `You have ${pendingRecords.length} submission(s) currently being verified. Your totals will update once approved.`;
                pendingMsg.style.display = 'block';
            } else {
                pendingMsg.style.display = 'none';
            }
        } else {
            alert("No participation record found for this wallet address.");
        }
    });
    
    // Buy Again / Upgrade Logic
    document.getElementById('portal-buy-again-btn').addEventListener('click', () => {
        const wallet = document.getElementById('portal-wallet').value.trim();
        const data = getWhitelistData();
        const node = data.find(item => item.wallet.toLowerCase() === wallet.toLowerCase());
        
        // 1. Close current Portal modal
        closeModal();
        
        // 2. Small delay to ensure smooth transition
        setTimeout(() => {
            // 3. Pre-fill data
            document.getElementById('whitelist-wallet').value = wallet;
            if (node && node.referrer !== "N/A") {
                document.getElementById('whitelist-referrer').value = node.referrer;
            }
            
            // 4. Open Whitelist modal via official function
            openModal();
        }, 300);
    });

    // --- 10. Smooth Navbar Transition ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.top = '1rem';
            navbar.style.padding = '1rem 2rem';
        } else {
            navbar.style.top = '2rem';
            navbar.style.padding = '1.5rem 3rem';
        }
    });

});
