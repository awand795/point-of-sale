import html2pdf from 'html2pdf.js';

/**
 * Export a DOM element as a PDF using html2pdf.js
 * @param {HTMLElement|string} element - The DOM element or CSS selector to capture
 * @param {Object} options - Export options
 * @param {string} options.filename - Output filename (default: 'document.pdf')
 * @param {string} options.title - Document title shown in the PDF header
 * @param {string} options.subtitle - Document subtitle
 * @param {boolean} options.landscape - Use landscape orientation (default: false)
 * @param {number} options.margin - Margin in mm (default: 10)
 * @param {'low'|'medium'|'high'} options.imageQuality - Image quality (default: 'high')
 * @param {Function} options.onStart - Callback when export starts
 * @param {Function} options.onComplete - Callback when export completes
 */
export const exportToPdf = async (element, options = {}) => {
    const {
        filename = 'document.pdf',
        title = '',
        subtitle = '',
        landscape = false,
        margin = 10,
        imageQuality = 'high',
        onStart,
        onComplete,
    } = options;

    onStart?.();

    try {
        // Resolve element
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) throw new Error('Element not found');

        // Clone the element to avoid modifying the live DOM
        const clone = el.cloneNode(true);
        
        // Create a wrapper for the PDF
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: ${landscape ? '297mm' : '210mm'};
            background: #fff;
            padding: 20px;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            z-index: -1;
        `;

        // Add title header
        if (title) {
            const header = document.createElement('div');
            header.style.cssText = `
                text-align: center;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 2px solid #1e293b;
            `;
            header.innerHTML = `
                <h1 style="font-size: 24px; font-weight: 900; color: #1e293b; margin: 0; letter-spacing: -0.03em;">
                    ${title}
                </h1>
                ${subtitle ? `<p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0 0; font-weight: 500;">${subtitle}</p>` : ''}
                <p style="font-size: 10px; color: #cbd5e1; margin: 8px 0 0 0;">
                    Generated on ${new Date().toLocaleDateString('id-ID', { 
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit' 
                    })}
                </p>
            `;
            wrapper.appendChild(header);
        }

        // Add footer watermark
        const footer = document.createElement('div');
        footer.style.cssText = `
            text-align: center;
            margin-top: 32px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            font-size: 9px;
            color: #94a3b8;
        `;
        footer.innerHTML = 'BikinPOS — Point of Sale System · www.bikinpos.com';
        wrapper.appendChild(footer);

        // Insert the cloned content before the footer
        wrapper.insertBefore(clone, footer);

        // Style the clone for print
        clone.style.cssText = 'width: 100%; margin: 0; padding: 0;';
        
        // Remove dark mode classes and fix scrollable containers in a single traversal
        const allEls = clone.querySelectorAll('*');
        for (const el of allEls) {
            // Strip dark: classes
            if (el.className && typeof el.className === 'string' && el.className.includes('dark:')) {
                el.className = el.className.replace(/dark:\S+/g, '').replace(/\s+/g, ' ').trim();
            }
            // Make scrollable containers visible for print
            if (el.matches('.overflow-y-auto, .overflow-x-auto, [class*="scrollbar"]')) {
                el.style.overflow = 'visible';
                el.style.maxHeight = 'none';
            }
        }

        document.body.appendChild(wrapper);

        // Map imageQuality to html2pdf.js quality
        const qualityMap = { low: 0.5, medium: 1, high: 2 };
        const scale = qualityMap[imageQuality] || 2;

        // Configure html2pdf.js
        const opt = {
            margin,
            filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale,
                useCORS: true,
                allowTaint: false,
                logging: false,
                backgroundColor: '#ffffff',
            },
            jsPDF: {
                unit: 'mm',
                format: landscape ? 'a4' : 'a4',
                orientation: landscape ? 'landscape' : 'portrait',
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        };

        // Generate PDF
        await html2pdf().set(opt).from(wrapper).save(filename);

        // Cleanup
        document.body.removeChild(wrapper);

        onComplete?.(true);
        return true;
    } catch (error) {
        console.error('PDF export failed:', error);
        // Cleanup on error
        const existingWrapper = document.querySelector('[style*="left: -9999px"]');
        if (existingWrapper) document.body.removeChild(existingWrapper);
        
        onComplete?.(false);
        throw error;
    }
};

/**
 * Export receipt content as a clean thermal-receipt-style PDF
 * Suitable for transaction receipts and invoice downloads
 */
export const exportReceiptPdf = async (receiptElement, options = {}) => {
    const { filename = 'receipt.pdf', onStart, onComplete } = options;

    onStart?.();

    try {
        const el = typeof receiptElement === 'string' ? document.querySelector(receiptElement) : receiptElement;
        if (!el) throw new Error('Receipt element not found');

        const clone = el.cloneNode(true);
        
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 80mm;
            background: #fff;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #000;
            padding: 10px 8px;
            z-index: -1;
        `;

        // Convert all text colors to black for thermal-style print
        const textEls = clone.querySelectorAll('*');
        for (const el of textEls) {
            el.style.color = '#000';
            el.style.backgroundColor = '';
            // Remove dark: classes
            if (el.className && typeof el.className === 'string' && el.className.includes('dark:')) {
                el.className = el.className.replace(/dark:\S+/g, '').replace(/\s+/g, ' ').trim();
            }
        }

        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        const opt = {
            margin: 0,
            filename,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: 80 * 3.78, // 80mm in pixels
            },
            jsPDF: {
                unit: 'mm',
                format: [80, 297], // 80mm width, auto height
                orientation: 'portrait',
            },
        };

        await html2pdf().set(opt).from(wrapper).save(filename);

        document.body.removeChild(wrapper);
        onComplete?.(true);
        return true;
    } catch (error) {
        console.error('Receipt PDF export failed:', error);
        const existing = document.querySelector('[style*="left: -9999px"]');
        if (existing) document.body.removeChild(existing);
        onComplete?.(false);
        throw error;
    }
};
