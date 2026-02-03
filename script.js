// تطبيق خرائط ذهنية متقدم - النسخة المحسنة
class MindMapperApp {
    constructor() {
        this.nodes = [];
        this.connectors = [];
        this.selectedNode = null;
        this.selectedConnector = null;
        this.currentNodeId = 1;
        this.currentConnectorId = 1;
        this.zoomLevel = 1;
        this.isDraggingCanvas = false;
        this.canvasPosition = { x: 0, y: 0 };
        this.dragStartPosition = { x: 0, y: 0 };
        this.isAddingConnector = false;
        this.connectorStartNode = null;
        this.currentTool = 'select';
        this.history = [];
        this.historyIndex = -1;
        this.canvas = null;
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.setupTemplatesModal();
        this.createCentralNode();
        this.updateCounters();
        this.saveToHistory(); // حفظ الحالة الأولية
        
        this.showToast('مرحباً في MindMapper Pro!', 'info', 'ابدأ بالنقر المزدوج لإضافة عقد جديدة');
        
        // تهيئة الشبكة
        this.toggleGrid(true);
    }
    
    bindElements() {
        this.canvas = document.getElementById('mindmapCanvas');
        this.nodeTextInput = document.getElementById('nodeText');
        this.mapTitleInput = document.getElementById('mapTitleInput');
        this.nodeColorInput = document.getElementById('nodeColor');
        this.fontFamilySelect = document.getElementById('fontFamily');
        this.fontSizeInput = document.getElementById('fontSize');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        this.backgroundColorInput = document.getElementById('backgroundColor');
        this.layoutTypeSelect = document.getElementById('layoutType');
        this.gridToggle = document.getElementById('gridToggle');
        this.nodeCount = document.getElementById('nodeCount');
        this.connectorCount = document.getElementById('connectorCount');
        this.zoomLevelElement = document.getElementById('zoomLevel');
        
        // الأدوات
        this.addCentralNodeBtn = document.getElementById('addCentralNode');
        this.addChildNodeBtn = document.getElementById('addChildNode');
        this.addSiblingNodeBtn = document.getElementById('addSiblingNode');
        this.addConnectorBtn = document.getElementById('addConnectorBtn');
        this.addImageBtn = document.getElementById('addImageBtn');
        this.addIconBtn = document.getElementById('addIconBtn');
        
        // الأزرار
        this.saveBtn = document.getElementById('saveBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.redoBtn = document.getElementById('redoBtn');
        this.arrangeBtn = document.getElementById('arrangeBtn');
        this.deleteNodeBtn = document.getElementById('deleteNodeBtn');
        this.duplicateNodeBtn = document.getElementById('duplicateNodeBtn');
        this.newMapBtn = document.getElementById('newMapBtn');
        this.templatesBtn = document.getElementById('templatesBtn');
        this.helpBtn = document.getElementById('helpBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        
        // النوافذ المنبثقة
        this.exportModal = document.getElementById('exportModal');
        this.templatesModal = document.getElementById('templatesModal');
        this.helpModal = document.getElementById('helpModal');
        
        // عناصر التحكم
        this.zoomInBtn = document.getElementById('zoomInBtn');
        this.zoomOutBtn = document.getElementById('zoomOutBtn');
        this.resetViewBtn = document.getElementById('resetViewBtn');
        this.fitToScreenBtn = document.getElementById('fitToScreenBtn');
        
        // خيارات التصدير
        this.confirmExportBtn = document.getElementById('confirmExportBtn');
        this.cancelExportBtn = document.getElementById('cancelExportBtn');
        
        // القائمة السياقية
        this.contextMenu = document.getElementById('contextMenu');
        
        // التبديل بين الأوضاع
        this.darkModeToggle = document.getElementById('darkModeToggle');
        
        // قوالب سريعة
        this.quickTemplates = document.querySelectorAll('.quick-templates .template-item');
        
        // إعدادات التصميم
        this.shapeButtons = document.querySelectorAll('.shape-btn');
        this.colorPresets = document.querySelectorAll('.quick-color');
        this.themeItems = document.querySelectorAll('.theme-item');
        this.formatButtons = document.querySelectorAll('.format-btn');
    }
    
    setupEventListeners() {
        // منطقة العمل الأساسية
        this.canvas.addEventListener('dblclick', (e) => this.handleCanvasDoubleClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleCanvasMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.handleCanvasWheel(e), { passive: false });
        
        // تحديث نص العقدة
        this.nodeTextInput.addEventListener('input', () => this.updateSelectedNodeText());
        this.nodeTextInput.addEventListener('blur', () => this.saveToHistory());
        
        // تحديث تصميم العقدة
        this.nodeColorInput.addEventListener('change', () => this.updateSelectedNodeStyle());
        this.fontFamilySelect.addEventListener('change', () => this.updateSelectedNodeStyle());
        this.fontSizeInput.addEventListener('input', () => {
            this.fontSizeValue.textContent = this.fontSizeInput.value;
            this.updateSelectedNodeStyle();
        });
        
        // تحديث إعدادات الخريطة
        this.backgroundColorInput.addEventListener('change', () => {
            this.canvas.style.backgroundColor = this.backgroundColorInput.value;
            this.saveToHistory();
        });
        
        this.gridToggle.addEventListener('change', () => {
            this.toggleGrid(this.gridToggle.checked);
        });
        
        // تحديث العنوان
        this.mapTitleInput.addEventListener('input', () => {
            document.title = `${this.mapTitleInput.value} - MindMapper Pro`;
            this.saveToHistory();
        });
        
        // أدوات إضافة العقد
        this.addCentralNodeBtn.addEventListener('click', () => this.addCentralNode());
        this.addChildNodeBtn.addEventListener('click', () => this.setTool('addChild'));
        this.addSiblingNodeBtn.addEventListener('click', () => this.setTool('addSibling'));
        this.addConnectorBtn.addEventListener('click', () => this.setTool('addConnector'));
        this.addImageBtn.addEventListener('click', () => this.addImageNode());
        this.addIconBtn.addEventListener('click', () => this.addIconNode());
        
        // أزرار التحكم
        this.saveBtn.addEventListener('click', () => this.saveMap());
        this.exportBtn.addEventListener('click', () => this.showExportModal());
        this.undoBtn.addEventListener('click', () => this.undo());
        this.redoBtn.addEventListener('click', () => this.redo());
        this.arrangeBtn.addEventListener('click', () => this.arrangeNodes());
        this.deleteNodeBtn.addEventListener('click', () => this.deleteSelectedNode());
        this.duplicateNodeBtn.addEventListener('click', () => this.duplicateSelectedNode());
        this.newMapBtn.addEventListener('click', () => this.newMap());
        this.templatesBtn.addEventListener('click', () => this.showTemplatesModal());
        this.helpBtn.addEventListener('click', () => this.showHelpModal());
        this.settingsBtn.addEventListener('click', () => this.showSettingsModal());
        this.shareBtn.addEventListener('click', () => this.shareMap());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // التحكم في العرض
        this.zoomInBtn.addEventListener('click', () => this.zoomIn());
        this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        this.resetViewBtn.addEventListener('click', () => this.resetView());
        this.fitToScreenBtn.addEventListener('click', () => this.fitToScreen());
        
        // خيارات التصدير
        this.confirmExportBtn.addEventListener('click', () => this.exportMap());
        this.cancelExportBtn.addEventListener('click', () => this.closeExportModal());
        
        // النوافذ المنبثقة
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.currentTarget.closest('.modal').style.display = 'none';
            });
        });
        
        // اختيار نوع التصدير
        document.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectExportOption(e));
        });
        
        // إغلاق النوافذ عند النقر خارجها
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // اختيار الأشكال
        this.shapeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.updateSelectedNodeShape(e.currentTarget.dataset.shape);
            });
        });
        
        // اختيار الألوان السريعة
        this.colorPresets.forEach(color => {
            color.addEventListener('click', (e) => {
                const bgColor = e.target.style.backgroundColor;
                this.nodeColorInput.value = this.rgbToHex(bgColor);
                this.updateSelectedNodeStyle();
            });
        });
        
        // اختيار الثيمات
        this.themeItems.forEach(item => {
            item.addEventListener('click', (e) => {
                document.querySelectorAll('.theme-item').forEach(i => i.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.applyTheme(e.currentTarget.dataset.theme);
            });
        });
        
        // القوالب السريعة
        this.quickTemplates.forEach(template => {
            template.addEventListener('click', (e) => {
                const templateType = e.currentTarget.dataset.template;
                this.loadQuickTemplate(templateType);
            });
        });
        
        // تنسيق النص
        this.formatButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.currentTarget.classList.toggle('active');
                this.applyTextFormatting(e.currentTarget.dataset.format);
            });
        });
        
        // القائمة السياقية
        document.addEventListener('click', () => this.hideContextMenu());
        
        // منع القائمة السياقية الافتراضية
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const target = e.target.closest('.mindmap-node');
            if (target) {
                const nodeId = parseInt(target.dataset.id);
                const node = this.nodes.find(n => n.id === nodeId);
                if (node) {
                    this.selectNode(node);
                    this.showContextMenu(e.clientX, e.clientY);
                }
            }
        });
        
        // أحداث القائمة السياقية
        this.contextMenu.querySelectorAll('.context-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleContextAction(action);
                this.hideContextMenu();
            });
        });
        
        // الوضع الليلي
        this.darkModeToggle.addEventListener('change', () => this.toggleDarkMode());
        
        // دعم اللمس
        this.setupTouchEvents();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // منع الاختصارات في حقول الإدخال
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                if (e.key === 'Escape') {
                    e.target.blur();
                }
                return;
            }
            
            switch(e.key) {
                case 'Delete':
                case 'Backspace':
                    e.preventDefault();
                    this.deleteSelectedNode();
                    break;
                case 'd':
                case 'D':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.duplicateSelectedNode();
                    }
                    break;
                case 'z':
                case 'Z':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                    }
                    break;
                case 'y':
                case 'Y':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.redo();
                    }
                    break;
                case 's':
                case 'S':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.saveMap();
                    }
                    break;
                case 'n':
                case 'N':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.newMap();
                    }
                    break;
                case '+':
                case '=':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.zoomIn();
                    }
                    break;
                case '-':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.zoomOut();
                    }
                    break;
                case '0':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.resetView();
                    }
                    break;
                case 'Escape':
                    this.selectedNode = null;
                    this.nodes.forEach(n => n.element.classList.remove('selected'));
                    break;
                case ' ':
                    // المسافة تبدأ سحب الخريطة
                    e.preventDefault();
                    this.canvas.style.cursor = 'grabbing';
                    break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === ' ') {
                this.canvas.style.cursor = 'grab';
            }
        });
    }
    
    setupTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
            } else if (e.touches.length === 2) {
                e.preventDefault();
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndTime = Date.now();
                
                const distance = Math.sqrt(
                    Math.pow(touchEndX - touchStartX, 2) + 
                    Math.pow(touchEndY - touchStartY, 2)
                );
                const duration = touchEndTime - touchStartTime;
                
                // إذا كانت لمسة سريعة وقصيرة، تعتبر نقرًا
                if (distance < 10 && duration < 300) {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = touchEndX - rect.left;
                    const y = touchEndY - rect.top;
                    
                    const target = document.elementFromPoint(touchEndX, touchEndY);
                    if (target && target.closest('.mindmap-node')) {
                        const nodeElement = target.closest('.mindmap-node');
                        const nodeId = parseInt(nodeElement.dataset.id);
                        const node = this.nodes.find(n => n.id === nodeId);
                        if (node) {
                            this.selectNode(node);
                        }
                    } else {
                        this.addNode('عقدة جديدة', x, y);
                    }
                }
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
                const touch = e.touches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                
                if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                    this.canvasPosition.x += deltaX;
                    this.canvasPosition.y += deltaY;
                    this.updateCanvasTransform();
                    
                    touchStartX = touch.clientX;
                    touchStartY = touch.clientY;
                }
            } else if (e.touches.length === 2) {
                e.preventDefault();
                // معالجة التكبير بالمسح
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                
                const currentDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) + 
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                // هذا مثال مبسط للتكبير بالمسح
                const scaleChange = currentDistance / 100;
                this.zoomLevel = Math.max(0.3, Math.min(3, scaleChange));
                this.updateCanvasTransform();
            }
        });
    }
    
    setupTemplatesModal() {
        const templatesGrid = document.getElementById('templatesGrid');
        
        templatesData.forEach(template => {
            const templateElement = document.createElement('div');
            templateElement.className = 'template-item';
            templateElement.dataset.templateId = template.id;
            
            templateElement.innerHTML = `
                <div class="template-preview" style="background: ${template.previewColor};">
                    <i class="${template.icon}" style="color: ${template.iconColor}; font-size: 3rem;"></i>
                </div>
                <div class="template-info">
                    <h4>${template.name}</h4>
                    <p>${template.description}</p>
                    <button class="btn-primary use-template-btn" data-template-id="${template.id}">
                        <i class="fas fa-check"></i> استخدام القالب
                    </button>
                </div>
            `;
            
            templatesGrid.appendChild(templateElement);
        });
        
        // أحداث أزرار استخدام القالب
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('use-template-btn')) {
                const templateId = e.target.dataset.templateId;
                this.loadTemplate(templateId);
                this.templatesModal.style.display = 'none';
            }
        });
    }
    
    createCentralNode() {
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;
        
        this.addNode('الفكرة الرئيسية', centerX, centerY, {
            isCentral: true,
            shape: 'circle',
            color: '#2E86AB',
            fontSize: 20,
            fontFamily: 'Cairo'
        });
    }
    
    addNode(text, x, y, options = {}) {
        const nodeId = this.currentNodeId++;
        const nodeElement = document.createElement('div');
        
        nodeElement.className = `mindmap-node shape-${options.shape || 'rounded'}`;
        nodeElement.id = `node-${nodeId}`;
        nodeElement.dataset.id = nodeId;
        
        nodeElement.style.left = `${x}px`;
        nodeElement.style.top = `${y}px`;
        nodeElement.style.backgroundColor = options.color || '#4a90e2';
        nodeElement.style.fontFamily = options.fontFamily || 'Cairo';
        nodeElement.style.fontSize = `${options.fontSize || 16}px`;
        nodeElement.style.color = this.getContrastColor(options.color || '#4a90e2');
        nodeElement.style.borderColor = options.borderColor || options.color || '#4a90e2';
        nodeElement.style.borderWidth = options.borderWidth ? `${options.borderWidth}px` : '3px';
        nodeElement.style.opacity = options.opacity || '1';
        
        // تطبيق التظليل إذا كان مفعلًا
        if (options.shadow !== false) {
            nodeElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'node-content';
        contentDiv.textContent = text;
        nodeElement.appendChild(contentDiv);
        
        // إضافة أيقونات التحكم
        const iconsDiv = document.createElement('div');
        iconsDiv.className = 'node-icons';
        iconsDiv.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
        iconsDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            const node = this.nodes.find(n => n.id === nodeId);
            if (node) {
                this.selectNode(node);
                this.showContextMenu(e.clientX, e.clientY);
            }
        });
        nodeElement.appendChild(iconsDiv);
        
        // أحداث العقدة
        nodeElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const node = this.nodes.find(n => n.id === nodeId);
            if (node) this.selectNode(node);
        });
        
        nodeElement.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const node = this.nodes.find(n => n.id === nodeId);
            if (node) this.editNodeText(node);
        });
        
        // جعل العقدة قابلة للسحب
        this.makeNodeDraggable(nodeElement, nodeId);
        
        this.canvas.appendChild(nodeElement);
        
        const node = {
            id: nodeId,
            element: nodeElement,
            x: x,
            y: y,
            text: text,
            shape: options.shape || 'rounded',
            color: options.color || '#4a90e2',
            fontFamily: options.fontFamily || 'Cairo',
            fontSize: options.fontSize || 16,
            borderColor: options.borderColor || options.color || '#4a90e2',
            borderWidth: options.borderWidth || 3,
            opacity: options.opacity || 1,
            shadow: options.shadow !== false,
            isCentral: options.isCentral || false,
            parentId: options.parentId || null,
            children: []
        };
        
        this.nodes.push(node);
        
        // إذا كانت عقدة فرعية، أضفها إلى أطفال العقدة الأم
        if (options.parentId) {
            const parent = this.nodes.find(n => n.id === options.parentId);
            if (parent) {
                parent.children.push(nodeId);
                
                // إنشاء رابط تلقائي بين العقدة الأم والفرعية
                this.createConnector(parent.id, nodeId);
            }
        }
        
        this.updateCounters();
        return node;
    }
    
    makeNodeDraggable(nodeElement, nodeId) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        nodeElement.addEventListener('mousedown', (e) => {
            if (e.target.closest('.node-icons')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = nodeElement.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            
            initialX = rect.left - canvasRect.left;
            initialY = rect.top - canvasRect.top;
            
            // رفع مستوى Z-index أثناء السحب
            nodeElement.style.zIndex = '10000';
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            
            e.preventDefault();
        });
        
        const drag = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newX = initialX + deltaX;
            const newY = initialY + deltaY;
            
            nodeElement.style.left = `${newX}px`;
            nodeElement.style.top = `${newY}px`;
            
            const node = this.nodes.find(n => n.id === nodeId);
            if (node) {
                node.x = newX;
                node.y = newY;
            }
            
            // تحديث الروابط المرتبطة
            this.updateConnectorsForNode(nodeId);
        };
        
        const stopDrag = () => {
            isDragging = false;
            nodeElement.style.zIndex = '';
            
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            
            // حفظ في التاريخ
            this.saveToHistory();
        };
    }
    
    createConnector(startNodeId, endNodeId) {
        const connectorId = this.currentConnectorId++;
        const startNode = this.nodes.find(n => n.id === startNodeId);
        const endNode = this.nodes.find(n => n.id === endNodeId);
        
        if (!startNode || !endNode) return null;
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add('mindmap-connector', 'curved');
        svg.id = `connector-${connectorId}`;
        svg.style.position = 'absolute';
        svg.style.pointerEvents = 'none';
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        svg.appendChild(path);
        
        this.canvas.appendChild(svg);
        
        const updateConnector = () => {
            const startRect = startNode.element.getBoundingClientRect();
            const endRect = endNode.element.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            
            const startX = startRect.left + startRect.width / 2 - canvasRect.left;
            const startY = startRect.top + startRect.height / 2 - canvasRect.top;
            const endX = endRect.left + endRect.width / 2 - canvasRect.left;
            const endY = endRect.top + endRect.height / 2 - canvasRect.top;
            
            // حساب نقاط التحكم لمنحني بيزير
            const dx = endX - startX;
            const dy = endY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // نقاط التحكم لمنحني طبيعي
            const controlOffset = Math.min(distance * 0.3, 100);
            
            let controlX1, controlY1, controlX2, controlY2;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                // رابط أفقي
                controlX1 = startX + dx * 0.5;
                controlY1 = startY;
                controlX2 = endX - dx * 0.5;
                controlY2 = endY;
            } else {
                // رابط عمودي
                controlX1 = startX;
                controlY1 = startY + dy * 0.5;
                controlX2 = endX;
                controlY2 = endY - dy * 0.5;
            }
            
            // إضافة انحناء طفيف
            if (Math.abs(dx) > 50 && Math.abs(dy) > 50) {
                controlY1 += controlOffset * (dx > 0 ? 1 : -1);
                controlX2 -= controlOffset * (dy > 0 ? 1 : -1);
            }
            
            const d = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
            path.setAttribute('d', d);
            path.setAttribute('stroke', '#4a90e2');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');
            
            // حساب حدود SVG
            const points = [
                {x: startX, y: startY},
                {x: endX, y: endY},
                {x: controlX1, y: controlY1},
                {x: controlX2, y: controlY2}
            ];
            
            let minX = Math.min(...points.map(p => p.x));
            let minY = Math.min(...points.map(p => p.y));
            let maxX = Math.max(...points.map(p => p.x));
            let maxY = Math.max(...points.map(p => p.y));
            
            // إضافة هامش
            const margin = 10;
            minX -= margin;
            minY -= margin;
            maxX += margin;
            maxY += margin;
            
            svg.style.left = `${minX}px`;
            svg.style.top = `${minY}px`;
            svg.setAttribute('width', `${maxX - minX}px`);
            svg.setAttribute('height', `${maxY - minY}px`);
            
            // تحديث مسار d بالنسب
            const relativeD = `M ${startX - minX} ${startY - minY} C ${controlX1 - minX} ${controlY1 - minY}, ${controlX2 - minX} ${controlY2 - minY}, ${endX - minX} ${endY - minY}`;
            path.setAttribute('d', relativeD);
        };
        
        updateConnector();
        
        const connector = {
            id: connectorId,
            element: svg,
            path: path,
            startNodeId: startNodeId,
            endNodeId: endNodeId,
            update: updateConnector
        };
        
        this.connectors.push(connector);
        this.updateCounters();
        
        return connector;
    }
    
    selectNode(node) {
        // إلغاء تحديد جميع العقد
        this.nodes.forEach(n => {
            n.element.classList.remove('selected');
        });
        
        // تحديد العقدة المحددة
        node.element.classList.add('selected');
        this.selectedNode = node;
        
        // تحديث خصائص الشريط الجانبي
        this.updateNodeProperties();
        
        // إذا كنا في وضع إضافة رابط
        if (this.currentTool === 'addConnector') {
            if (!this.connectorStartNode) {
                this.connectorStartNode = node;
                this.showToast('اختر العقدة الهدف', 'info', 'انقر على العقدة الأخرى لإنشاء الرابط');
            } else {
                this.createConnector(this.connectorStartNode.id, node.id);
                this.connectorStartNode = null;
                this.setTool('select');
                this.showToast('تم إنشاء الرابط', 'success');
            }
        } else if (this.currentTool === 'addChild') {
            this.addChildNodeToSelected();
            this.setTool('select');
        } else if (this.currentTool === 'addSibling') {
            this.addSiblingToSelected();
            this.setTool('select');
        }
    }
    
    updateNodeProperties() {
        if (!this.selectedNode) {
            document.getElementById('nodeProperties').style.opacity = '0.5';
            document.getElementById('deleteNodeBtn').disabled = true;
            document.getElementById('duplicateNodeBtn').disabled = true;
            return;
        }
        
        document.getElementById('nodeProperties').style.opacity = '1';
        document.getElementById('deleteNodeBtn').disabled = false;
        document.getElementById('duplicateNodeBtn').disabled = false;
        
        this.nodeTextInput.value = this.selectedNode.text;
        this.nodeColorInput.value = this.selectedNode.color;
        this.fontFamilySelect.value = this.selectedNode.fontFamily;
        this.fontSizeInput.value = this.selectedNode.fontSize;
        this.fontSizeValue.textContent = this.selectedNode.fontSize;
        
        // تحديث أزرار الأشكال
        this.shapeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.shape === this.selectedNode.shape) {
                btn.classList.add('active');
            }
        });
        
        // تحديث التظليل
        document.getElementById('shadowToggle').checked = this.selectedNode.shadow;
        
        // تحدبيق الشفافية
        document.getElementById('opacitySlider').value = this.selectedNode.opacity * 100;
        document.getElementById('opacityValue').textContent = `${Math.round(this.selectedNode.opacity * 100)}%`;
    }
    
    updateSelectedNodeText() {
        if (!this.selectedNode) return;
        
        this.selectedNode.text = this.nodeTextInput.value;
        this.selectedNode.element.querySelector('.node-content').textContent = this.nodeTextInput.value;
    }
    
    updateSelectedNodeStyle() {
        if (!this.selectedNode) return;
        
        const color = this.nodeColorInput.value;
        const fontFamily = this.fontFamilySelect.value;
        const fontSize = this.fontSizeInput.value;
        
        this.selectedNode.color = color;
        this.selectedNode.fontFamily = fontFamily;
        this.selectedNode.fontSize = fontSize;
        
        const nodeElement = this.selectedNode.element;
        nodeElement.style.backgroundColor = color;
        nodeElement.style.fontFamily = fontFamily;
        nodeElement.style.fontSize = `${fontSize}px`;
        nodeElement.style.color = this.getContrastColor(color);
    }
    
    updateSelectedNodeShape(shape) {
        if (!this.selectedNode) return;
        
        this.selectedNode.shape = shape;
        const nodeElement = this.selectedNode.element;
        
        // إزالة جميع كلاسات الأشكال
        nodeElement.classList.remove('shape-circle', 'shape-rounded', 'shape-rectangle', 'shape-cloud', 'shape-hexagon');
        nodeElement.classList.add(`shape-${shape}`);
        
        // ضبط أبعاد خاصة للأشكال
        if (shape === 'circle') {
            nodeElement.style.minWidth = '100px';
            nodeElement.style.minHeight = '100px';
        } else {
            nodeElement.style.minWidth = '140px';
            nodeElement.style.minHeight = '60px';
        }
    }
    
    applyTextFormatting(format) {
        if (!this.selectedNode) return;
        
        const contentDiv = this.selectedNode.element.querySelector('.node-content');
        const currentStyle = contentDiv.style;
        
        switch(format) {
            case 'bold':
                currentStyle.fontWeight = currentStyle.fontWeight === 'bold' ? 'normal' : 'bold';
                break;
            case 'italic':
                currentStyle.fontStyle = currentStyle.fontStyle === 'italic' ? 'normal' : 'italic';
                break;
            case 'underline':
                currentStyle.textDecoration = currentStyle.textDecoration === 'underline' ? 'none' : 'underline';
                break;
        }
    }
    
    editNodeText(node) {
        const contentDiv = node.element.querySelector('.node-content');
        const currentText = contentDiv.textContent;
        
        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        textarea.className = 'node-edit-textarea';
        textarea.style.width = 'calc(100% - 30px)';
        textarea.style.height = 'calc(100% - 30px)';
        textarea.style.maxWidth = '300px';
        textarea.style.maxHeight = '200px';
        textarea.style.border = '2px solid var(--primary)';
        textarea.style.background = 'rgba(255, 255, 255, 0.95)';
        textarea.style.fontFamily = node.fontFamily;
        textarea.style.fontSize = `${node.fontSize}px`;
        textarea.style.color = this.getContrastColor(node.color);
        textarea.style.textAlign = 'center';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.padding = '10px';
        textarea.style.borderRadius = '8px';
        textarea.style.position = 'absolute';
        textarea.style.top = '50%';
        textarea.style.left = '50%';
        textarea.style.transform = 'translate(-50%, -50%)';
        textarea.style.zIndex = '10001';
        textarea.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        
        node.element.style.position = 'relative';
        node.element.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        const saveEdit = () => {
            const newText = textarea.value.trim() || 'عقدة جديدة';
            node.text = newText;
            contentDiv.textContent = newText;
            this.updateNodeProperties();
            textarea.remove();
            this.saveToHistory();
        };
        
        const cancelEdit = () => {
            contentDiv.textContent = currentText;
            textarea.remove();
        };
        
        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveEdit();
            } else if (e.key === 'Escape') {
                cancelEdit();
            }
        });
        
        // إيقاف أحداث العقدة أثناء التحرير
        textarea.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    }
    
    deleteSelectedNode() {
        if (!this.selectedNode) {
            this.showToast('يرجى تحديد عقدة أولاً', 'warning');
            return;
        }
        
        if (this.selectedNode.isCentral) {
            this.showToast('لا يمكن حذف العقدة المركزية', 'error');
            return;
        }
        
        if (confirm('هل أنت متأكد من حذف هذه العقدة؟')) {
            const nodeId = this.selectedNode.id;
            this.deleteNode(nodeId);
            this.selectedNode = null;
            this.updateCounters();
            this.saveToHistory();
            this.showToast('تم حذف العقدة', 'success');
        }
    }
    
    deleteNode(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;
        
        // حذف العقدة الفرعية أولاً
        node.children.forEach(childId => {
            this.deleteNode(childId);
        });
        
        // حذف العقدة نفسها
        node.element.remove();
        this.nodes = this.nodes.filter(n => n.id !== nodeId);
        
        // حذف الروابط المرتبطة
        this.connectors = this.connectors.filter(connector => {
            if (connector.startNodeId === nodeId || connector.endNodeId === nodeId) {
                connector.element.remove();
                return false;
            }
            return true;
        });
        
        // إزالة العقدة من قائمة الأطفال في العقدة الأم
        if (node.parentId) {
            const parent = this.nodes.find(n => n.id === node.parentId);
            if (parent) {
                parent.children = parent.children.filter(id => id !== nodeId);
            }
        }
    }
    
    duplicateSelectedNode() {
        if (!this.selectedNode) {
            this.showToast('يرجى تحديد عقدة أولاً', 'warning');
            return;
        }
        
        const node = this.selectedNode;
        const newX = node.x + 40;
        const newY = node.y + 40;
        
        const newNode = this.addNode(node.text + ' (نسخة)', newX, newY, {
            shape: node.shape,
            color: node.color,
            fontFamily: node.fontFamily,
            fontSize: node.fontSize,
            borderColor: node.borderColor,
            borderWidth: node.borderWidth,
            opacity: node.opacity,
            shadow: node.shadow,
            parentId: node.parentId
        });
        
        this.selectNode(newNode);
        this.showToast('تم نسخ العقدة', 'success');
    }
    
    setTool(tool) {
        this.currentTool = tool;
        
        // تحديث حالة الأزرار
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        
        switch(tool) {
            case 'select':
                this.canvas.style.cursor = 'grab';
                this.showToast('وضع التحديد', 'info');
                break;
            case 'addChild':
                this.addChildNodeBtn.classList.add('active');
                this.canvas.style.cursor = 'crosshair';
                this.showToast('وضع إضافة عقدة فرعية', 'info', 'انقر على عقدة لإضافة فرعية لها');
                break;
            case 'addSibling':
                this.addSiblingNodeBtn.classList.add('active');
                this.canvas.style.cursor = 'crosshair';
                this.showToast('وضع إضافة عقدة شقيقة', 'info', 'انقر على عقدة لإضافة شقيقة لها');
                break;
            case 'addConnector':
                this.addConnectorBtn.classList.add('active');
                this.canvas.style.cursor = 'crosshair';
                this.showToast('وضع إضافة رابط', 'info', 'انقر على عقدتين لربطهما');
                break;
        }
    }
    
    addCentralNode() {
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;
        
        const node = this.addNode('عقدة مركزية جديدة', centerX, centerY, {
            isCentral: true,
            shape: 'circle',
            color: '#2E86AB',
            fontSize: 20
        });
        
        this.selectNode(node);
        this.showToast('تمت إضافة عقدة مركزية', 'success');
    }
    
    addChildNodeToSelected() {
        if (!this.selectedNode) {
            this.showToast('يرجى تحديد عقدة أولاً', 'warning');
            return;
        }
        
        const parentNode = this.selectedNode;
        const angle = (parentNode.children.length * 45) * Math.PI / 180;
        const distance = 180;
        
        const childX = parentNode.x + Math.cos(angle) * distance;
        const childY = parentNode.y + Math.sin(angle) * distance;
        
        const childNode = this.addNode('عقدة فرعية', childX, childY, {
            parentId: parentNode.id,
            shape: 'rounded',
            color: this.generateChildColor(parentNode.color)
        });
        
        this.selectNode(childNode);
        this.showToast('تمت إضافة عقدة فرعية', 'success');
    }
    
    addSiblingToSelected() {
        if (!this.selectedNode) {
            this.showToast('يرجى تحديد عقدة أولاً', 'warning');
            return;
        }
        
        const siblingNode = this.selectedNode;
        const offsetX = 220;
        
        const newX = siblingNode.x + offsetX;
        const newY = siblingNode.y;
        
        const newNode = this.addNode('عقدة شقيقة', newX, newY, {
            parentId: siblingNode.parentId,
            shape: siblingNode.shape,
            color: siblingNode.color
        });
        
        this.selectNode(newNode);
        this.showToast('تمت إضافة عقدة شقيقة', 'success');
    }
    
    addImageNode() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgUrl = event.target.result;
                    const centerX = this.canvas.clientWidth / 2;
                    const centerY = this.canvas.clientHeight / 2;
                    
                    const node = this.addNode('', centerX, centerY, {
                        shape: 'rectangle'
                    });
                    
                    node.element.style.backgroundImage = `url(${imgUrl})`;
                    node.element.style.backgroundSize = 'cover';
                    node.element.style.backgroundPosition = 'center';
                    node.element.style.minWidth = '200px';
                    node.element.style.minHeight = '150px';
                    node.element.querySelector('.node-content').style.display = 'none';
                    
                    // حفظ رابط الصورة في بيانات العقدة
                    node.imageUrl = imgUrl;
                    
                    this.selectNode(node);
                    this.showToast('تمت إضافة صورة', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    }
    
    addIconNode() {
        const icons = [
            'fa-heart', 'fa-star', 'fa-flag', 'fa-bolt', 'fa-cloud', 
            'fa-sun', 'fa-moon', 'fa-gem', 'fa-crown', 'fa-rocket'
        ];
        
        // إنشاء قائمة منبثقة لاختيار الأيقونة
        const iconSelector = document.createElement('div');
        iconSelector.className = 'icon-selector';
        iconSelector.style.position = 'fixed';
        iconSelector.style.top = '50%';
        iconSelector.style.left = '50%';
        iconSelector.style.transform = 'translate(-50%, -50%)';
        iconSelector.style.background = 'white';
        iconSelector.style.borderRadius = '12px';
        iconSelector.style.padding = '20px';
        iconSelector.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
        iconSelector.style.zIndex = '10000';
        iconSelector.style.display = 'grid';
        iconSelector.style.gridTemplateColumns = 'repeat(5, 1fr)';
        iconSelector.style.gap = '10px';
        iconSelector.style.maxWidth = '300px';
        
        icons.forEach(icon => {
            const iconBtn = document.createElement('button');
            iconBtn.className = 'icon-btn';
            iconBtn.innerHTML = `<i class="fas ${icon}"></i>`;
            iconBtn.style.width = '40px';
            iconBtn.style.height = '40px';
            iconBtn.style.border = 'none';
            iconBtn.style.background = '#f0f0f0';
            iconBtn.style.borderRadius = '8px';
            iconBtn.style.cursor = 'pointer';
            iconBtn.style.fontSize = '1.2rem';
            iconBtn.style.transition = 'all 0.2s ease';
            
            iconBtn.addEventListener('mouseover', () => {
                iconBtn.style.background = '#2E86AB';
                iconBtn.style.color = 'white';
                iconBtn.style.transform = 'scale(1.1)';
            });
            
            iconBtn.addEventListener('mouseout', () => {
                iconBtn.style.background = '#f0f0f0';
                iconBtn.style.color = '';
                iconBtn.style.transform = 'scale(1)';
            });
            
            iconBtn.addEventListener('click', () => {
                const centerX = this.canvas.clientWidth / 2;
                const centerY = this.canvas.clientHeight / 2;
                
                const node = this.addNode('', centerX, centerY, {
                    shape: 'circle',
                    color: '#9D4EDD'
                });
                
                node.element.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                        <i class="fas ${icon}" style="font-size: 32px; color: white;"></i>
                    </div>
                `;
                
                node.icon = icon;
                
                this.selectNode(node);
                iconSelector.remove();
                this.showToast('تمت إضافة أيقونة', 'success');
            });
            
            iconSelector.appendChild(iconBtn);
        });
        
        // زر الإغلاق
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'إغلاق';
        closeBtn.style.gridColumn = 'span 5';
        closeBtn.style.marginTop = '15px';
        closeBtn.style.padding = '10px';
        closeBtn.style.background = '#f0f0f0';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '8px';
        closeBtn.style.cursor = 'pointer';
        
        closeBtn.addEventListener('click', () => {
            iconSelector.remove();
        });
        
        iconSelector.appendChild(closeBtn);
        
        document.body.appendChild(iconSelector);
        
        // إغلاق عند النقر خارج المنطقة
        document.addEventListener('click', function closeIconSelector(e) {
            if (!iconSelector.contains(e.target)) {
                iconSelector.remove();
                document.removeEventListener('click', closeIconSelector);
            }
        });
    }
    
    handleCanvasDoubleClick(e) {
        if (e.target.closest('.mindmap-node')) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const node = this.addNode('عقدة جديدة', x, y);
        this.selectNode(node);
    }
    
    handleCanvasMouseDown(e) {
        if (e.button !== 0) return; // زر الفأرة الأيسر فقط
        
        const target = e.target;
        
        // إذا تم النقر على العقدة، دع العقدة تتعامل مع الحدث
        if (target.closest('.mindmap-node')) {
            return;
        }
        
        // بدء سحب الخريطة
        this.isDraggingCanvas = true;
        this.dragStartPosition = { 
            x: e.clientX - this.canvasPosition.x, 
            y: e.clientY - this.canvasPosition.y 
        };
        
        this.canvas.classList.add('dragging');
        this.canvas.style.cursor = 'grabbing';
        
        e.preventDefault();
    }
    
    handleCanvasMouseMove(e) {
        if (!this.isDraggingCanvas) return;
        
        this.canvasPosition.x = e.clientX - this.dragStartPosition.x;
        this.canvasPosition.y = e.clientY - this.dragStartPosition.y;
        
        this.updateCanvasTransform();
    }
    
    handleCanvasMouseUp() {
        if (this.isDraggingCanvas) {
            this.isDraggingCanvas = false;
            this.canvas.classList.remove('dragging');
            this.canvas.style.cursor = 'grab';
            this.saveToHistory();
        }
    }
    
    handleCanvasWheel(e) {
        e.preventDefault();
        
        const zoomIntensity = 0.001;
        const wheelDelta = e.deltaY;
        const zoom = Math.exp(-wheelDelta * zoomIntensity);
        
        // حساب المركز قبل التكبير
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // حساب إزاحة المركز
        const offsetX = (mouseX - this.canvasPosition.x) * (zoom - 1);
        const offsetY = (mouseY - this.canvasPosition.y) * (zoom - 1);
        
        // تحديث مستوى التكبير
        this.zoomLevel *= zoom;
        this.zoomLevel = Math.max(0.1, Math.min(5, this.zoomLevel));
        
        // تحديث الموقع للحفاظ على المؤشر في نفس المكان
        this.canvasPosition.x -= offsetX;
        this.canvasPosition.y -= offsetY;
        
        this.updateCanvasTransform();
    }
    
    zoomIn() {
        this.zoomLevel *= 1.2;
        this.zoomLevel = Math.min(5, this.zoomLevel);
        this.updateCanvasTransform();
        this.showToast(`التكبير: ${Math.round(this.zoomLevel * 100)}%`, 'info');
    }
    
    zoomOut() {
        this.zoomLevel /= 1.2;
        this.zoomLevel = Math.max(0.1, this.zoomLevel);
        this.updateCanvasTransform();
        this.showToast(`التصغير: ${Math.round(this.zoomLevel * 100)}%`, 'info');
    }
    
    resetView() {
        this.zoomLevel = 1;
        this.canvasPosition = { x: 0, y: 0 };
        this.updateCanvasTransform();
        this.showToast('تم إعادة تعيين العرض', 'success');
    }
    
    fitToScreen() {
        if (this.nodes.length === 0) return;
        
        // حساب الحدود
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        this.nodes.forEach(node => {
            const nodeWidth = node.element.offsetWidth || 140;
            const nodeHeight = node.element.offsetHeight || 60;
            
            minX = Math.min(minX, node.x);
            minY = Math.min(minY, node.y);
            maxX = Math.max(maxX, node.x + nodeWidth);
            maxY = Math.max(maxY, node.y + nodeHeight);
        });
        
        const width = maxX - minX + 200;
        const height = maxY - minY + 200;
        const canvasWidth = this.canvas.parentElement.clientWidth;
        const canvasHeight = this.canvas.parentElement.clientHeight;
        
        const scaleX = canvasWidth / width;
        const scaleY = canvasHeight / height;
        this.zoomLevel = Math.min(scaleX, scaleY, 1) * 0.9;
        
        // حساب المركز
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        
        this.canvasPosition.x = (canvasWidth / 2) - (centerX * this.zoomLevel);
        this.canvasPosition.y = (canvasHeight / 2) - (centerY * this.zoomLevel);
        
        this.updateCanvasTransform();
        this.showToast('تم ملاءمة الخريطة للشاشة', 'success');
    }
    
    updateCanvasTransform() {
        this.canvas.style.transform = `
            translate(${this.canvasPosition.x}px, ${this.canvasPosition.y}px) 
            scale(${this.zoomLevel})
        `;
        this.zoomLevelElement.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }
    
    updateConnectorsForNode(nodeId) {
        this.connectors.forEach(connector => {
            if (connector.startNodeId === nodeId || connector.endNodeId === nodeId) {
                if (connector.update) connector.update();
            }
        });
    }
    
    arrangeNodes() {
        const layoutType = this.layoutTypeSelect.value;
        
        switch(layoutType) {
            case 'radial':
                this.arrangeRadial();
                break;
            case 'tree':
                this.arrangeTree(true);
                break;
            case 'horizontal':
                this.arrangeTree(false);
                break;
            case 'org':
                this.arrangeOrganizational();
                break;
        }
        
        this.showToast(`تم الترتيب بنمط ${layoutType}`, 'success');
        this.saveToHistory();
    }
    
    arrangeRadial() {
        const centralNode = this.nodes.find(n => n.isCentral);
        if (!centralNode) return;
        
        const centerX = this.canvas.parentElement.clientWidth / 2;
        const centerY = this.canvas.parentElement.clientHeight / 2;
        
        // وضع العقدة المركزية في المنتصف
        this.moveNodeTo(centralNode, centerX, centerY);
        
        // ترتيب العقد الفرعية في دوائر
        const radius = 200;
        const angleStep = (2 * Math.PI) / Math.max(1, centralNode.children.length);
        
        centralNode.children.forEach((childId, index) => {
            const child = this.nodes.find(n => n.id === childId);
            if (!child) return;
            
            const angle = index * angleStep;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            this.moveNodeTo(child, x, y);
            
            // ترتيب أحفاد كل عقدة فرعية
            this.arrangeChildrenRadial(child, radius + 150, angle, angleStep / 2);
        });
        
        this.updateAllConnectors();
    }
    
    arrangeChildrenRadial(node, radius, parentAngle, angleRange) {
        if (node.children.length === 0) return;
        
        const startAngle = parentAngle - angleRange / 2;
        const childAngleStep = angleRange / Math.max(1, node.children.length);
        
        node.children.forEach((childId, index) => {
            const child = this.nodes.find(n => n.id === childId);
            if (!child) return;
            
            const angle = startAngle + (index + 0.5) * childAngleStep;
            const x = node.x + radius * Math.cos(angle);
            const y = node.y + radius * Math.sin(angle);
            
            this.moveNodeTo(child, x, y);
            
            this.arrangeChildrenRadial(child, radius, angle, childAngleStep);
        });
    }
    
    arrangeTree(vertical = true) {
        const centralNode = this.nodes.find(n => n.isCentral);
        if (!centralNode) return;
        
        const centerX = this.canvas.parentElement.clientWidth / 2;
        const centerY = this.canvas.parentElement.clientHeight / 2;
        
        this.moveNodeTo(centralNode, centerX, centerY);
        
        this.arrangeChildrenTree(centralNode, 0, 0, vertical);
        this.updateAllConnectors();
    }
    
    arrangeChildrenTree(node, depth, position, vertical = true) {
        if (node.children.length === 0) return;
        
        const spacing = vertical ? 150 : 200;
        const offset = vertical ? 200 : 150;
        const totalWidth = node.children.length * spacing;
        const startX = vertical ? node.x - totalWidth / 2 + spacing / 2 : node.x + offset;
        const startY = vertical ? node.y + offset : node.y - totalWidth / 2 + spacing / 2;
        
        node.children.forEach((childId, index) => {
            const child = this.nodes.find(n => n.id === childId);
            if (!child) return;
            
            const x = vertical ? startX + index * spacing : startX;
            const y = vertical ? startY : startY + index * spacing;
            
            this.moveNodeTo(child, x, y);
            
            this.arrangeChildrenTree(child, depth + 1, index, vertical);
        });
    }
    
    arrangeOrganizational() {
        const levels = {};
        
        // تجميع العقد حسب المستوى
        this.nodes.forEach(node => {
            const level = this.getNodeLevel(node);
            if (!levels[level]) levels[level] = [];
            levels[level].push(node);
        });
        
        const centerX = this.canvas.parentElement.clientWidth / 2;
        const levelHeight = 180;
        const nodeSpacing = 220;
        
        Object.keys(levels).sort((a, b) => a - b).forEach(level => {
            const nodes = levels[level];
            const totalWidth = nodes.length * nodeSpacing;
            const startX = centerX - totalWidth / 2 + nodeSpacing / 2;
            const y = 100 + parseInt(level) * levelHeight;
            
            nodes.forEach((node, index) => {
                const x = startX + index * nodeSpacing;
                this.moveNodeTo(node, x, y);
            });
        });
        
        this.updateAllConnectors();
    }
    
    getNodeLevel(node, level = 0) {
        if (!node.parentId) return level;
        
        const parent = this.nodes.find(n => n.id === node.parentId);
        if (!parent) return level;
        
        return this.getNodeLevel(parent, level + 1);
    }
    
    moveNodeTo(node, x, y) {
        node.x = x;
        node.y = y;
        node.element.style.left = `${x}px`;
        node.element.style.top = `${y}px`;
    }
    
    updateAllConnectors() {
        this.connectors.forEach(connector => {
            if (connector.update) connector.update();
        });
    }
    
    saveToHistory() {
        const snapshot = {
            nodes: this.nodes.map(node => ({
                id: node.id,
                x: node.x,
                y: node.y,
                text: node.text,
                shape: node.shape,
                color: node.color,
                fontFamily: node.fontFamily,
                fontSize: node.fontSize,
                borderColor: node.borderColor,
                borderWidth: node.borderWidth,
                opacity: node.opacity,
                shadow: node.shadow,
                isCentral: node.isCentral,
                parentId: node.parentId,
                children: [...node.children]
            })),
            connectors: this.connectors.map(connector => ({
                id: connector.id,
                startNodeId: connector.startNodeId,
                endNodeId: connector.endNodeId
            })),
            canvasPosition: {...this.canvasPosition},
            zoomLevel: this.zoomLevel,
            backgroundColor: this.backgroundColorInput.value,
            mapTitle: this.mapTitleInput.value
        };
        
        // إزالة العناصر بعد المؤشر الحالي
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.parse(JSON.stringify(snapshot)));
        this.historyIndex++;
        
        // تحديد حجم التاريخ
        if (this.history.length > 100) {
            this.history.shift();
            this.historyIndex--;
        }
        
        // تحديث حالة أزرار التراجع والإعادة
        this.undoBtn.disabled = this.historyIndex <= 0;
        this.redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
    
    undo() {
        if (this.historyIndex <= 0) return;
        
        this.historyIndex--;
        this.restoreFromHistory();
        this.showToast('تم التراجع', 'info');
    }
    
    redo() {
        if (this.historyIndex >= this.history.length - 1) return;
        
        this.historyIndex++;
        this.restoreFromHistory();
        this.showToast('تم الإعادة', 'info');
    }
    
    restoreFromHistory() {
        if (this.historyIndex < 0 || this.historyIndex >= this.history.length) return;
        
        const snapshot = this.history[this.historyIndex];
        
        // إزالة جميع العناصر الحالية
        this.nodes.forEach(node => node.element.remove());
        this.connectors.forEach(connector => connector.element.remove());
        
        // إعادة تعيين البيانات
        this.nodes = [];
        this.connectors = [];
        this.selectedNode = null;
        this.currentNodeId = 1;
        this.currentConnectorId = 1;
        
        // استعادة العقد
        snapshot.nodes.forEach(nodeData => {
            const node = this.addNode(nodeData.text, nodeData.x, nodeData.y, {
                id: nodeData.id,
                shape: nodeData.shape,
                color: nodeData.color,
                fontFamily: nodeData.fontFamily,
                fontSize: nodeData.fontSize,
                borderColor: nodeData.borderColor,
                borderWidth: nodeData.borderWidth,
                opacity: nodeData.opacity,
                shadow: nodeData.shadow,
                isCentral: nodeData.isCentral,
                parentId: nodeData.parentId
            });
            
            node.children = [...nodeData.children];
            
            // تحديث معرف العقدة الحالي
            this.currentNodeId = Math.max(this.currentNodeId, nodeData.id + 1);
        });
        
        // استعادة الروابط
        snapshot.connectors.forEach(connectorData => {
            const startNode = this.nodes.find(n => n.id === connectorData.startNodeId);
            const endNode = this.nodes.find(n => n.id === connectorData.endNodeId);
            
            if (startNode && endNode) {
                const connector = this.createConnector(startNode.id, endNode.id);
                if (connector) {
                    connector.id = connectorData.id;
                    this.currentConnectorId = Math.max(this.currentConnectorId, connectorData.id + 1);
                }
            }
        });
        
        // استعادة إعدادات الخريطة
        this.canvasPosition = {...snapshot.canvasPosition};
        this.zoomLevel = snapshot.zoomLevel;
        this.backgroundColorInput.value = snapshot.backgroundColor;
        this.mapTitleInput.value = snapshot.mapTitle;
        this.canvas.style.backgroundColor = snapshot.backgroundColor;
        
        this.updateCanvasTransform();
        this.updateCounters();
        
        // تحديث حالة أزرار التراجع والإعادة
        this.undoBtn.disabled = this.historyIndex <= 0;
        this.redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
    
    showExportModal() {
        this.exportModal.style.display = 'flex';
    }
    
    closeExportModal() {
        this.exportModal.style.display = 'none';
    }
    
    selectExportOption(e) {
        document.querySelectorAll('.export-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        e.currentTarget.classList.add('selected');
    }
    
    exportMap() {
        const selectedOption = document.querySelector('.export-option.selected');
        if (!selectedOption) {
            this.showToast('يرجى اختيار نوع التصدير', 'warning');
            return;
        }
        
        const format = selectedOption.dataset.type;
        const includeBackground = document.getElementById('includeBackground').checked;
        const quality = document.getElementById('exportQuality').value;
        
        // إخفاء عناصر التحكم غير المرغوب فيها
        const elementsToHide = [
            '.view-controls',
            '.quick-help',
            '.node-icons',
            '.center-guide'
        ];
        
        const originalStyles = [];
        elementsToHide.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                originalStyles.push({
                    element: el,
                    display: el.style.display
                });
                el.style.display = 'none';
            });
        });
        
        // تعيين جودة التصدير
        const scale = quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1;
        
        // أخذ لقطة للشاشة
        html2canvas(this.canvas, {
            backgroundColor: includeBackground ? this.backgroundColorInput.value : null,
            scale: scale,
            useCORS: true,
            allowTaint: true,
            logging: false
        }).then(canvas => {
            // استعادة عرض العناصر المخفية
            originalStyles.forEach(item => {
                item.element.style.display = item.display;
            });
            
            const link = document.createElement('a');
            const filename = `${this.mapTitleInput.value || 'mindmap'}_${Date.now()}`;
            
            switch(format) {
                case 'png':
                    link.download = `${filename}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    break;
                    
                case 'jpg':
                    link.download = `${filename}.jpg`;
                    link.href = canvas.toDataURL('image/jpeg', 0.9);
                    link.click();
                    break;
                    
                case 'pdf':
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('landscape', 'mm', 'a4');
                    const imgData = canvas.toDataURL('image/png');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    
                    // حساب نسبة العرض إلى الارتفاع
                    const imgRatio = canvas.width / canvas.height;
                    let imgWidth = pdfWidth;
                    let imgHeight = pdfWidth / imgRatio;
                    
                    if (imgHeight > pdfHeight) {
                        imgHeight = pdfHeight;
                        imgWidth = pdfHeight * imgRatio;
                    }
                    
                    // وضع الصورة في المركز
                    const x = (pdfWidth - imgWidth) / 2;
                    const y = (pdfHeight - imgHeight) / 2;
                    
                    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
                    pdf.save(`${filename}.pdf`);
                    break;
                    
                case 'svg':
                    // محاكاة لملف SVG
                    this.showToast('تصدير SVG قادم قريباً', 'info');
                    break;
            }
            
            this.exportModal.style.display = 'none';
            this.showToast(`تم التصدير كـ ${format.toUpperCase()}`, 'success');
            
        }).catch(error => {
            console.error('خطأ في التصدير:', error);
            this.showToast('حدث خطأ أثناء التصدير', 'error');
            
            // استعادة عرض العناصر المخفية في حالة الخطأ
            originalStyles.forEach(item => {
                item.element.style.display = item.display;
            });
        });
    }
    
    saveMap() {
        try {
            const mapData = {
                version: '2.0',
                title: this.mapTitleInput.value,
                backgroundColor: this.backgroundColorInput.value,
                canvasPosition: {...this.canvasPosition},
                zoomLevel: this.zoomLevel,
                nodes: this.nodes.map(node => ({
                    id: node.id,
                    x: node.x,
                    y: node.y,
                    text: node.text,
                    shape: node.shape,
                    color: node.color,
                    fontFamily: node.fontFamily,
                    fontSize: node.fontSize,
                    borderColor: node.borderColor,
                    borderWidth: node.borderWidth,
                    opacity: node.opacity,
                    shadow: node.shadow,
                    isCentral: node.isCentral,
                    parentId: node.parentId,
                    children: [...node.children],
                    imageUrl: node.imageUrl,
                    icon: node.icon
                })),
                connectors: this.connectors.map(connector => ({
                    id: connector.id,
                    startNodeId: connector.startNodeId,
                    endNodeId: connector.endNodeId
                }))
            };
            
            const dataStr = JSON.stringify(mapData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const dataUrl = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.download = `mindmap_${Date.now()}.json`;
            link.href = dataUrl;
            link.click();
            
            // تحرير الذاكرة
            setTimeout(() => URL.revokeObjectURL(dataUrl), 100);
            
            this.showToast('تم حفظ الخريطة', 'success');
            
        } catch (error) {
            console.error('خطأ في الحفظ:', error);
            this.showToast('حدث خطأ أثناء الحفظ', 'error');
        }
    }
    
    newMap() {
        if (confirm('هل أنت متأكد من إنشاء خريطة جديدة؟ سيتم فقدان التغييرات غير المحفوظة.')) {
            // إزالة جميع العقد
            this.nodes.forEach(node => node.element.remove());
            this.connectors.forEach(connector => connector.element.remove());
            
            // إعادة تعيين البيانات
            this.nodes = [];
            this.connectors = [];
            this.selectedNode = null;
            this.currentNodeId = 1;
            this.currentConnectorId = 1;
            this.canvasPosition = { x: 0, y: 0 };
            this.zoomLevel = 1;
            
            // إعادة تعيين العنوان
            this.mapTitleInput.value = 'خريطة ذهنية جديدة';
            
            // إعادة تعيين الخلفية
            this.backgroundColorInput.value = '#f8f9fa';
            this.canvas.style.backgroundColor = '#f8f9fa';
            
            // إنشاء عقدة مركزية جديدة
            this.createCentralNode();
            
            // تحديث العرض
            this.updateCanvasTransform();
            this.updateCounters();
            
            // حفظ الحالة الأولية
            this.history = [];
            this.historyIndex = -1;
            this.saveToHistory();
            
            this.showToast('تم إنشاء خريطة جديدة', 'success');
        }
    }
    
    loadQuickTemplate(templateType) {
        const templates = {
            brainstorm: {
                name: 'العصف الذهني',
                centralNode: {
                    text: 'الفكرة الرئيسية',
                    color: '#FFD166',
                    shape: 'cloud'
                },
                childNodes: [
                    {
                        text: 'الأفكار الأولية',
                        color: '#FF9E6D',
                        shape: 'rounded'
                    },
                    {
                        text: 'التطوير',
                        color: '#4ECDC4',
                        shape: 'rounded'
                    },
                    {
                        text: 'التنفيذ',
                        color: '#2A9D8F',
                        shape: 'rounded'
                    }
                ]
            },
            study: {
                name: 'خطة الدراسة',
                centralNode: {
                    text: 'خطة الدراسة',
                    color: '#2E86AB',
                    shape: 'rounded'
                },
                childNodes: [
                    {
                        text: 'المواد',
                        color: '#4ECDC4',
                        shape: 'circle'
                    },
                    {
                        text: 'الجدول',
                        color: '#FF6B6B',
                        shape: 'circle'
                    },
                    {
                        text: 'الموارد',
                        color: '#9D4EDD',
                        shape: 'circle'
                    },
                    {
                        text: 'الأهداف',
                        color: '#FFD166',
                        shape: 'circle'
                    }
                ]
            },
            project: {
                name: 'إدارة المشروع',
                centralNode: {
                    text: 'المشروع الرئيسي',
                    color: '#2A9D8F',
                    shape: 'rectangle'
                },
                childNodes: [
                    {
                        text: 'الفريق',
                        color: '#2E86AB',
                        shape: 'hexagon'
                    },
                    {
                        text: 'المهام',
                        color: '#FF6B6B',
                        shape: 'hexagon'
                    },
                    {
                        text: 'الجدول',
                        color: '#FFD166',
                        shape: 'hexagon'
                    }
                ]
            },
            swot: {
                name: 'تحليل SWOT',
                centralNode: {
                    text: 'تحليل SWOT',
                    color: '#F18F01',
                    shape: 'hexagon'
                },
                childNodes: [
                    {
                        text: 'نقاط القوة',
                        color: '#2A9D8F',
                        shape: 'rounded'
                    },
                    {
                        text: 'نقاط الضعف',
                        color: '#FF6B6B',
                        shape: 'rounded'
                    },
                    {
                        text: 'الفرص',
                        color: '#2E86AB',
                        shape: 'rounded'
                    },
                    {
                        text: 'التهديدات',
                        color: '#9D4EDD',
                        shape: 'rounded'
                    }
                ]
            }
        };
        
        const template = templates[templateType];
        if (!template) return;
        
        // إنشاء خريطة جديدة
        this.newMap();
        
        // تحديث العقدة المركزية
        if (this.nodes[0]) {
            const centralNode = this.nodes[0];
            centralNode.text = template.centralNode.text;
            centralNode.element.querySelector('.node-content').textContent = template.centralNode.text;
            centralNode.color = template.centralNode.color;
            centralNode.shape = template.centralNode.shape;
            
            centralNode.element.style.backgroundColor = template.centralNode.color;
            centralNode.element.classList.remove('shape-circle', 'shape-rounded', 'shape-rectangle', 'shape-cloud', 'shape-hexagon');
            centralNode.element.classList.add(`shape-${template.centralNode.shape}`);
            
            // إضافة العقد الفرعية
            template.childNodes.forEach((child, index) => {
                const angle = (index * 90) * Math.PI / 180;
                const distance = 200;
                const centerX = this.canvas.parentElement.clientWidth / 2;
                const centerY = this.canvas.parentElement.clientHeight / 2;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                this.addNode(child.text, x, y, {
                    parentId: centralNode.id,
                    shape: child.shape,
                    color: child.color
                });
            });
            
            this.selectNode(centralNode);
        }
        
        this.showToast(`تم تحميل قالب ${template.name}`, 'success');
    }
    
    loadTemplate(templateId) {
        const template = templatesData.find(t => t.id === templateId);
        if (!template) return;
        
        // إنشاء خريطة جديدة
        this.newMap();
        
        // تحديث العنوان
        this.mapTitleInput.value = template.name;
        
        // تحديث العقدة المركزية
        if (this.nodes[0]) {
            const centralNode = this.nodes[0];
            centralNode.text = template.structure.centralNode.text;
            centralNode.element.querySelector('.node-content').textContent = template.structure.centralNode.text;
            centralNode.color = template.structure.centralNode.color;
            centralNode.shape = template.structure.centralNode.shape;
            
            centralNode.element.style.backgroundColor = template.structure.centralNode.color;
            centralNode.element.classList.remove('shape-circle', 'shape-rounded', 'shape-rectangle', 'shape-cloud', 'shape-hexagon');
            centralNode.element.classList.add(`shape-${template.structure.centralNode.shape}`);
            
            // إضافة العقد الفرعية
            template.structure.childNodes.forEach((child, index) => {
                const angle = (index * 90) * Math.PI / 180;
                const distance = 200;
                const centerX = this.canvas.parentElement.clientWidth / 2;
                const centerY = this.canvas.parentElement.clientHeight / 2;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                const childNode = this.addNode(child.text, x, y, {
                    parentId: centralNode.id,
                    shape: child.shape,
                    color: child.color
                });
                
                // إضافة العقد الفرعية للعقدة الفرعية
                if (child.children) {
                    child.children.forEach((grandChild, grandIndex) => {
                        const childAngle = angle + (grandIndex - 0.5) * 0.5;
                        const childDistance = distance + 120;
                        const childX = x + Math.cos(childAngle) * childDistance;
                        const childY = y + Math.sin(childAngle) * childDistance;
                        
                        this.addNode(grandChild.text, childX, childY, {
                            parentId: childNode.id,
                            shape: 'rounded',
                            color: grandChild.color
                        });
                    });
                }
            });
            
            this.selectNode(centralNode);
        }
        
        this.showToast(`تم تحميل قالب "${template.name}"`, 'success');
    }
    
    showTemplatesModal() {
        this.templatesModal.style.display = 'flex';
    }
    
    showHelpModal() {
        this.helpModal.style.display = 'flex';
    }
    
    showSettingsModal() {
        this.showToast('إعدادات التطبيق', 'info', 'ستكون متاحة قريباً');
    }
    
    shareMap() {
        this.showToast('مشاركة الخريطة', 'info', 'ستكون متاحة قريباً');
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`خطأ في ملء الشاشة: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    showContextMenu(x, y) {
        this.contextMenu.style.left = `${x}px`;
        this.contextMenu.style.top = `${y}px`;
        this.contextMenu.style.display = 'block';
        
        // إغلاق القائمة عند النقر خارجها
        setTimeout(() => {
            const closeContextMenu = (e) => {
                if (!this.contextMenu.contains(e.target)) {
                    this.hideContextMenu();
                    document.removeEventListener('click', closeContextMenu);
                }
            };
            document.addEventListener('click', closeContextMenu);
        }, 100);
    }
    
    hideContextMenu() {
        this.contextMenu.style.display = 'none';
    }
    
    handleContextAction(action) {
        if (!this.selectedNode) return;
        
        switch(action) {
            case 'edit':
                this.editNodeText(this.selectedNode);
                break;
            case 'duplicate':
                this.duplicateSelectedNode();
                break;
            case 'delete':
                this.deleteSelectedNode();
                break;
            case 'addChild':
                this.addChildNodeToSelected();
                break;
            case 'addSibling':
                this.addSiblingToSelected();
                break;
            case 'changeColor':
                this.nodeColorInput.click();
                break;
            case 'changeShape':
                // فتح محاورة لاختيار الشكل
                const shapeOptions = ['circle', 'rounded', 'rectangle', 'cloud', 'hexagon'];
                const currentIndex = shapeOptions.indexOf(this.selectedNode.shape);
                const nextIndex = (currentIndex + 1) % shapeOptions.length;
                this.updateSelectedNodeShape(shapeOptions[nextIndex]);
                break;
        }
    }
    
    toggleGrid(show) {
        const grid = this.canvas.querySelector('.canvas-grid');
        if (grid) {
            grid.classList.toggle('active', show);
            grid.classList.toggle('inactive', !show);
        }
    }
    
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#ffffff';
            this.showToast('تم تفعيل الوضع الليلي', 'info');
        } else {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            this.showToast('تم تعطيل الوضع الليلي', 'info');
        }
    }
    
    applyTheme(themeName) {
        const themes = {
            professional: {
                primary: '#2E86AB',
                secondary: '#A23B72',
                accent: '#F18F01',
                background: '#f8f9fa'
            },
            creative: {
                primary: '#9D4EDD',
                secondary: '#FF6B6B',
                accent: '#4ECDC4',
                background: '#fff9e6'
            },
            nature: {
                primary: '#2A9D8F',
                secondary: '#E9C46A',
                accent: '#E76F51',
                background: '#f1f8e9'
            }
        };
        
        const theme = themes[themeName];
        if (!theme) return;
        
        // تحديث متغيرات CSS
        document.documentElement.style.setProperty('--primary', theme.primary);
        document.documentElement.style.setProperty('--secondary', theme.secondary);
        document.documentElement.style.setProperty('--accent', theme.accent);
        
        // تحديث خلفية الخريطة
        this.backgroundColorInput.value = theme.background;
        this.canvas.style.backgroundColor = theme.background;
        
        this.showToast(`تم تطبيق ثيم ${themeName}`, 'success');
    }
    
    updateCounters() {
        this.nodeCount.textContent = `${this.nodes.length} فقاعة`;
        this.connectorCount.textContent = `${this.connectors.length} رابط`;
    }
    
    showToast(title, type, message = '') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // إزالة التوست بعد 4 ثوان
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
    
    // دوال مساعدة
    getContrastColor(hexColor) {
        if (!hexColor || hexColor === 'transparent') return '#000000';
        
        // تحويل HEX إلى RGB
        let r, g, b;
        
        if (hexColor.startsWith('#')) {
            r = parseInt(hexColor.substr(1, 2), 16);
            g = parseInt(hexColor.substr(3, 2), 16);
            b = parseInt(hexColor.substr(5, 2), 16);
        } else if (hexColor.startsWith('rgb')) {
            const match = hexColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                r = parseInt(match[1]);
                g = parseInt(match[2]);
                b = parseInt(match[3]);
            } else {
                return '#000000';
            }
        } else {
            return '#000000';
        }
        
        // حساب السطوع
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    }
    
    rgbToHex(rgb) {
        if (!rgb) return '#000000';
        
        if (rgb.startsWith('#')) return rgb;
        
        const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return '#000000';
        
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    generateChildColor(parentColor) {
        // توليد لون فرعي متناسق مع اللون الأم
        const hex = parentColor.replace('#', '');
        if (hex.length !== 6) return '#4a90e2';
        
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // تغيير قليلاً للون
        const newR = Math.min(255, Math.max(0, r + 40));
        const newG = Math.min(255, Math.max(0, g + 40));
        const newB = Math.min(255, Math.max(0, b + 40));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
}

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const app = new MindMapperApp();
    
    // جعل التطبيق متاحاً عالمياً للتصحيح
    window.mindMapperApp = app;
    
    // تهيئة حدث ملء الشاشة
    document.addEventListener('fullscreenchange', () => {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            fullscreenBtn.title = 'الخروج من ملء الشاشة';
        } else {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenBtn.title = 'ملء الشاشة';
        }
    });
    
    // منع سلوك السحب الافتراضي
    document.addEventListener('dragstart', (e) => {
        if (e.target.closest('.mindmap-node')) {
            e.preventDefault();
        }
    });
    
    // إظهار رسالة ترحيب إضافية
    setTimeout(() => {
        app.showToast('نصيحة سريعة', 'info', 'استخدم الاختصارات Ctrl+Z للتراجع و Ctrl+Y للإعادة');
    }, 2000);
});