// بيانات القوالب
const templatesData = [
    {
        id: 'brainstorming',
        name: 'العصف الذهني',
        description: 'مثالي لجمع الأفكار الإبداعية',
        icon: 'fas fa-lightbulb',
        iconColor: '#FFD166',
        previewColor: '#FFF9E6',
        structure: {
            centralNode: {
                text: 'الفكرة الرئيسية',
                color: '#FFD166',
                shape: 'cloud'
            },
            childNodes: [
                {
                    text: 'الأفكار الأولية',
                    color: '#FF9E6D',
                    shape: 'rounded',
                    children: [
                        { text: 'فكرة 1', color: '#FF9E6D' },
                        { text: 'فكرة 2', color: '#FF9E6D' }
                    ]
                },
                {
                    text: 'التطوير',
                    color: '#4ECDC4',
                    shape: 'rounded',
                    children: [
                        { text: 'تحسين', color: '#4ECDC4' },
                        { text: 'تكامل', color: '#4ECDC4' }
                    ]
                },
                {
                    text: 'التنفيذ',
                    color: '#2A9D8F',
                    shape: 'rounded',
                    children: [
                        { text: 'خطوات', color: '#2A9D8F' },
                        { text: 'موارد', color: '#2A9D8F' }
                    ]
                }
            ]
        }
    },
    {
        id: 'study-plan',
        name: 'خطة الدراسة',
        description: 'لتنظيم المواد والمواعيد الدراسية',
        icon: 'fas fa-graduation-cap',
        iconColor: '#2E86AB',
        previewColor: '#E7F3FF',
        structure: {
            centralNode: {
                text: 'خطة الدراسة',
                color: '#2E86AB',
                shape: 'rounded'
            },
            childNodes: [
                {
                    text: 'المواد',
                    color: '#4ECDC4',
                    shape: 'circle',
                    children: [
                        { text: 'رياضيات', color: '#4ECDC4' },
                        { text: 'علوم', color: '#4ECDC4' },
                        { text: 'لغة', color: '#4ECDC4' }
                    ]
                },
                {
                    text: 'الجدول',
                    color: '#FF6B6B',
                    shape: 'circle',
                    children: [
                        { text: 'يومي', color: '#FF6B6B' },
                        { text: 'أسبوعي', color: '#FF6B6B' }
                    ]
                },
                {
                    text: 'الموارد',
                    color: '#9D4EDD',
                    shape: 'circle',
                    children: [
                        { text: 'كتب', color: '#9D4EDD' },
                        { text: 'دورات', color: '#9D4EDD' }
                    ]
                },
                {
                    text: 'الأهداف',
                    color: '#FFD166',
                    shape: 'circle',
                    children: [
                        { text: 'قصيرة', color: '#FFD166' },
                        { text: 'طويلة', color: '#FFD166' }
                    ]
                }
            ]
        }
    },
    {
        id: 'project-management',
        name: 'إدارة المشاريع',
        description: 'لتخطيط ومتابعة المشاريع',
        icon: 'fas fa-project-diagram',
        iconColor: '#2A9D8F',
        previewColor: '#E7F8ED',
        structure: {
            centralNode: {
                text: 'المشروع الرئيسي',
                color: '#2A9D8F',
                shape: 'rectangle'
            },
            childNodes: [
                {
                    text: 'الفريق',
                    color: '#2E86AB',
                    shape: 'hexagon',
                    children: [
                        { text: 'مطورون', color: '#2E86AB' },
                        { text: 'مصممون', color: '#2E86AB' }
                    ]
                },
                {
                    text: 'المهام',
                    color: '#FF6B6B',
                    shape: 'hexagon',
                    children: [
                        { text: 'التصميم', color: '#FF6B6B' },
                        { text: 'التطوير', color: '#FF6B6B' }
                    ]
                },
                {
                    text: 'الجدول',
                    color: '#FFD166',
                    shape: 'hexagon',
                    children: [
                        { text: 'مرحلة 1', color: '#FFD166' },
                        { text: 'مرحلة 2', color: '#FFD166' }
                    ]
                }
            ]
        }
    },
    {
        id: 'personal-goals',
        name: 'الأهداف الشخصية',
        description: 'لتنظيم أهداف الحياة والتطوير',
        icon: 'fas fa-bullseye',
        iconColor: '#A23B72',
        previewColor: '#F8E8F0',
        structure: {
            centralNode: {
                text: 'التطوير الشخصي',
                color: '#A23B72',
                shape: 'circle'
            },
            childNodes: [
                {
                    text: 'الصحة',
                    color: '#2A9D8F',
                    shape: 'rounded',
                    children: [
                        { text: 'تمارين', color: '#2A9D8F' },
                        { text: 'تغذية', color: '#2A9D8F' }
                    ]
                },
                {
                    text: 'المعرفة',
                    color: '#2E86AB',
                    shape: 'rounded',
                    children: [
                        { text: 'قراءة', color: '#2E86AB' },
                        { text: 'دورات', color: '#2E86AB' }
                    ]
                },
                {
                    text: 'المهارات',
                    color: '#9D4EDD',
                    shape: 'rounded',
                    children: [
                        { text: 'تقنية', color: '#9D4EDD' },
                        { text: 'لغات', color: '#9D4EDD' }
                    ]
                },
                {
                    text: 'العلاقات',
                    color: '#FF6B6B',
                    shape: 'rounded',
                    children: [
                        { text: 'عائلة', color: '#FF6B6B' },
                        { text: 'أصدقاء', color: '#FF6B6B' }
                    ]
                }
            ]
        }
    }
];
// ===========================================
// بيانات القوالب المحسنة
// =========================================== 

const advancedTemplates = [
    {
        id: 'business-plan',
        name: 'خطة عمل',
        description: 'لإنشاء خطط العمل والمشاريع التجارية',
        icon: 'fas fa-briefcase',
        iconColor: '#2E86AB',
        previewColor: '#E7F3FF',
        structure: {
            centralNode: {
                text: 'خطة العمل',
                color: '#2E86AB',
                shape: 'rectangle'
            },
            childNodes: [
                {
                    text: 'المنتج',
                    color: '#4ECDC4',
                    shape: 'rounded',
                    children: [
                        { text: 'المميزات', color: '#4ECDC4' },
                        { text: 'السعر', color: '#4ECDC4' }
                    ]
                },
                {
                    text: 'السوق',
                    color: '#FF6B6B',
                    shape: 'rounded',
                    children: [
                        { text: 'المنافسة', color: '#FF6B6B' },
                        { text: 'العملاء', color: '#FF6B6B' }
                    ]
                },
                {
                    text: 'التسويق',
                    color: '#9D4EDD',
                    shape: 'rounded',
                    children: [
                        { text: 'الإعلان', color: '#9D4EDD' },
                        { text: 'التواصل', color: '#9D4EDD' }
                    ]
                },
                {
                    text: 'المالية',
                    color: '#FFD166',
                    shape: 'rounded',
                    children: [
                        { text: 'الميزانية', color: '#FFD166' },
                        { text: 'الأرباح', color: '#FFD166' }
                    ]
                }
            ]
        }
    },
    {
        id: 'website-structure',
        name: 'هيكل الموقع',
        description: 'لتصميم هيكل المواقع والتطبيقات',
        icon: 'fas fa-sitemap',
        iconColor: '#9D4EDD',
        previewColor: '#F3E8FF',
        structure: {
            centralNode: {
                text: 'الرئيسية',
                color: '#9D4EDD',
                shape: 'hexagon'
            },
            childNodes: [
                {
                    text: 'من نحن',
                    color: '#4ECDC4',
                    shape: 'rounded',
                    children: [
                        { text: 'الفريق', color: '#4ECDC4' },
                        { text: 'التاريخ', color: '#4ECDC4' }
                    ]
                },
                {
                    text: 'الخدمات',
                    color: '#FF6B6B',
                    shape: 'rounded',
                    children: [
                        { text: 'التصميم', color: '#FF6B6B' },
                        { text: 'التطوير', color: '#FF6B6B' }
                    ]
                },
                {
                    text: 'المشاريع',
                    color: '#FFD166',
                    shape: 'rounded',
                    children: [
                        { text: 'الحالية', color: '#FFD166' },
                        { text: 'السابقة', color: '#FFD166' }
                    ]
                },
                {
                    text: 'اتصل بنا',
                    color: '#2A9D8F',
                    shape: 'rounded',
                    children: [
                        { text: 'النموذج', color: '#2A9D8F' },
                        { text: 'المعلومات', color: '#2A9D8F' }
                    ]
                }
            ]
        }
    }
];

// دمج القوالب
const allTemplates = [...templatesData, ...advancedTemplates];