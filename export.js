// وظائف التصدير المتقدمة
const ExportManager = {
    // تصدير متعدد الصيغ
    exportMultipleFormats: function(formats) {
        formats.forEach(format => {
            setTimeout(() => {
                this.exportSingleFormat(format);
            }, formats.indexOf(format) * 1000);
        });
    },
    
    exportSingleFormat: function(format) {
        switch(format) {
            case 'png':
                this.exportAsPNG();
                break;
            case 'jpg':
                this.exportAsJPG();
                break;
            case 'pdf':
                this.exportAsPDF();
                break;
            case 'gif':
                this.exportAsGIF();
                break;
        }
    },
    
    exportAsPNG: function() {
        console.log('Exporting as PNG...');
        // سيتم تنفيذ هذا من خلال html2canvas في الملف الرئيسي
    },
    
    exportAsJPG: function() {
        console.log('Exporting as JPG...');
        // سيتم تنفيذ هذا من خلال html2canvas في الملف الرئيسي
    },
    
    exportAsPDF: function() {
        console.log('Exporting as PDF...');
        // سيتم تنفيذ هذا من خلال jsPDF في الملف الرئيسي
    },
    
    exportAsGIF: function() {
        console.log('Exporting as GIF...');
        // محاكاة لإنشاء GIF متحرك
        this.createAnimatedGIF();
    },
    
    createAnimatedGIF: function() {
        // في التطبيق الحقيقي، نستخدم مكتبة مثل gif.js لإنشاء GIF متحرك
        // يظهر العقد واحدة تلو الأخرى مع تأثيرات
        console.log('Creating animated GIF...');
        
        // هذا مثال مبسط لما يمكن عمله:
        // 1. أخذ لقطات متعددة للخريطة مع إظهار تدريجي للعقد
        // 2. جمع اللقطات في إطار GIF متحرك
        // 3. تحميل ملف GIF الناتج
    },
    
    // حفظ الإعدادات المفضلة للتصدير
    saveExportPreferences: function(prefs) {
        localStorage.setItem('mindmap_export_prefs', JSON.stringify(prefs));
    },
    
    loadExportPreferences: function() {
        const prefs = localStorage.getItem('mindmap_export_prefs');
        return prefs ? JSON.parse(prefs) : {
            defaultFormat: 'png',
            includeBackground: true,
            quality: 'high'
        };
    },
    
    // إنشاء تقرير نصي مع الخريطة
    generateTextReport: function(mapData) {
        let report = `تقرير الخريطة الذهنية\n`;
        report += `====================\n\n`;
        report += `العنوان: ${mapData.title}\n`;
        report += `تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-SA')}\n`;
        report += `عدد العقد: ${mapData.nodes.length}\n`;
        report += `عدد الروابط: ${mapData.connectors.length}\n\n`;
        
        report += `العقد الرئيسية:\n`;
        mapData.nodes.forEach((node, index) => {
            report += `${index + 1}. ${node.text}\n`;
        });
        
        return report;
    },
    
    // تصدير كملف نصي
    exportAsText: function(mapData) {
        const report = this.generateTextReport(mapData);
        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `mindmap_report_${Date.now()}.txt`;
        link.click();
    }
};