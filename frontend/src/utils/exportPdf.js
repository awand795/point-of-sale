import html2pdf from 'html2pdf.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Export a data array as a PDF table using jsPDF + jspdf-autotable (no DOM rendering)
 * @param {Object[]} data - Array of row objects
 * @param {Object} options
 * @param {string} options.filename
 * @param {string} options.title
 * @param {string} options.subtitle
 * @param {boolean} options.landscape
 * @param {Array} options.columns - Array of {header, dataKey} objects
 */
export const exportTableToPdf = (data, options = {}) => {
    const {
        filename = 'document.pdf',
        title = '',
        subtitle = '',
        landscape = false,
        columns = [],
    } = options;

    try {
        const doc = new jsPDF({
            orientation: landscape ? 'landscape' : 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageW = doc.internal.pageSize.getWidth();
        const margin = 14;

        // ---- Title ----
        if (title) {
            doc.setFontSize(16);
            doc.setTextColor(30, 41, 59);
            doc.text(title, margin, 22);

            if (subtitle) {
                doc.setFontSize(9);
                doc.setTextColor(148, 163, 184);
                doc.text(subtitle, margin, 30);
            }

            doc.setDrawColor(226, 232, 240);
            doc.line(margin, 35, pageW - margin, 35);
        }

        // ---- Table ----
        const startY = title ? 42 : 20;

        doc.autoTable({
            columns,
            body: data,
            startY,
            styles: {
                fontSize: 7.5,
                cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
                textColor: [51, 65, 85],
                lineColor: [226, 232, 240],
                lineWidth: 0.1,
                overflow: 'linebreak',
            },
            headStyles: {
                fillColor: [30, 41, 59],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 7.5,
                halign: 'center',
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252],
            },
            margin: { top: 20, bottom: 25, left: margin, right: margin },
        });

        // Write footer on each page
        const totalPages = doc.internal.getNumberOfPages();
        const genDate = new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text(
                `BikinPOS — Point of Sale System · ${genDate} · Page ${i} of ${totalPages}`,
                pageW / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' },
            );
        }

        doc.save(filename);
        return true;
    } catch (error) {
        console.error('Table PDF export failed:', error);
        throw error;
    }
};

/**
 * Export report data as a multi-section PDF using jsPDF (no DOM rendering)
 * Renders summary stats, top products, and category breakdown as clean tables.
 */
export const exportReportToPdf = (reports, options = {}) => {
    const {
        filename = 'report.pdf',
        title = 'Laporan',
        subtitle = '',
        locale = 'id',
    } = options;

    const fmtCurrency = (v) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`;
    const fmtNumber = (v) => Number(v || 0).toLocaleString('id-ID');
    const t = (id, en) => locale === 'id' ? id : en;

    try {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const margin = 14;
        let y = 20;

        // ---- Title ----
        doc.setFontSize(16);
        doc.setTextColor(30, 41, 59);
        doc.text(title, margin, y);
        y += 7;
        if (subtitle) {
            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184);
            doc.text(subtitle, margin, y);
            y += 5;
        }
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y + 2, pageW - margin, y + 2);
        y += 8;

        // ---- Summary Section ----
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.setFont(undefined, 'bold');
        doc.text(t('Ringkasan', 'Summary'), margin, y);
        doc.setFont(undefined, 'normal');
        y += 6;

        const summaryData = [
            [t('Total Pendapatan', 'Total Revenue'), fmtCurrency(reports?.total_revenue)],
            [t('Total Pesanan', 'Total Orders'), fmtNumber(reports?.total_orders)],
            [t('Barang Terjual', 'Items Sold'), fmtNumber(reports?.total_items)],
            [t('Rata-rata Pesanan', 'Avg Order Value'), fmtCurrency(reports?.avg_order_value)],
        ];

        doc.autoTable({
            body: summaryData,
            startY: y,
            theme: 'plain',
            styles: { fontSize: 9, cellPadding: { top: 3, right: 6, bottom: 3, left: 6 } },
            columnStyles: {
                0: { fontStyle: 'bold', textColor: [51, 65, 85], cellWidth: 80 },
                1: { textColor: [30, 41, 59], halign: 'right', cellWidth: 50 },
            },
            margin: { left: margin, right: margin },
            tableLineWidth: 0,
        });

        y = doc.lastAutoTable.finalY + 12;

        // ---- Top Products ----
        const products = reports?.top_products || [];
        if (products.length > 0) {
            // Check if we need a new page
            if (y > 240) { doc.addPage(); y = 20; }

            doc.setFontSize(11);
            doc.setTextColor(30, 41, 59);
            doc.setFont(undefined, 'bold');
            doc.text(t('Produk Terlaris', 'Top Products'), margin, y);
            doc.setFont(undefined, 'normal');
            y += 6;

            doc.autoTable({
                head: [[
                    '#',
                    t('Nama Produk', 'Product Name'),
                    t('Terjual', 'Sold'),
                    t('Pendapatan', 'Revenue'),
                ]],
                body: products.map((p, i) => [
                    `${i + 1}`,
                    p.name || '-',
                    fmtNumber(p.total_sold),
                    fmtCurrency(p.revenue),
                ]),
                startY: y,
                headStyles: {
                    fillColor: [30, 41, 59],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 8,
                },
                styles: { fontSize: 8, cellPadding: { top: 2.5, right: 3, bottom: 2.5, left: 3 } },
                columnStyles: {
                    0: { cellWidth: 10, halign: 'center' },
                    1: { cellWidth: 80 },
                    2: { cellWidth: 25, halign: 'right' },
                    3: { cellWidth: 40, halign: 'right' },
                },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                margin: { left: margin, right: margin },
            });

            y = doc.lastAutoTable.finalY + 12;
        }

        // ---- Category Breakdown ----
        const categories = reports?.category_breakdown || [];
        if (categories.length > 0) {
            if (y > 240) { doc.addPage(); y = 20; }

            doc.setFontSize(11);
            doc.setTextColor(30, 41, 59);
            doc.setFont(undefined, 'bold');
            doc.text(t('Kategori', 'Category Breakdown'), margin, y);
            doc.setFont(undefined, 'normal');
            y += 6;

            doc.autoTable({
                head: [[
                    t('Kategori', 'Category'),
                    t('Pendapatan', 'Revenue'),
                    t('Persentase', 'Percentage'),
                ]],
                body: categories.map(c => [
                    c.name || '-',
                    fmtCurrency(c.revenue),
                    `${c.percentage || 0}%`,
                ]),
                startY: y,
                headStyles: {
                    fillColor: [30, 41, 59],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 8,
                },
                styles: { fontSize: 8, cellPadding: { top: 2.5, right: 3, bottom: 2.5, left: 3 } },
                columnStyles: {
                    0: { cellWidth: 90 },
                    1: { cellWidth: 40, halign: 'right' },
                    2: { cellWidth: 25, halign: 'right' },
                },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                margin: { left: margin, right: margin },
            });

            y = doc.lastAutoTable.finalY + 12;
        }

        // ---- Footer on each page ----
        const totalPages = doc.internal.getNumberOfPages();
        const genDate = new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text(
                `BikinPOS — Point of Sale System · ${genDate} · Page ${i} of ${totalPages}`,
                pageW / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' },
            );
        }

        doc.save(filename);
        return true;
    } catch (error) {
        console.error('Report PDF export failed:', error);
        throw error;
    }
};

/**
 * Export a DOM element as a PDF using html2pdf.js
 * Note: This uses html2canvas under the hood which can freeze the UI for large content.
 * Prefer exportTableToPdf or exportReportToPdf for data-driven exports.
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
        imageQuality = 'medium',
        onStart,
        onComplete,
    } = options;

    onStart?.();

    // Yield to let the UI update loading state before heavy work
    await new Promise(r => setTimeout(r, 50));

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
 * Export receipt data as a thermal-receipt-style PDF using jsPDF (no DOM rendering, no html2canvas)
 * Accepts transaction data object directly — fast and doesn't freeze the UI.
 * @param {Object} data - Transaction object with items, totals, etc.
 * @param {Object} options
 * @param {string} options.filename - Output filename (default: 'receipt.pdf')
 * @param {string} options.storeName - Store name for header (default: 'BikinPOS')
 */
export const exportReceiptPdf = (data, options = {}) => {
    const {
        filename = 'receipt.pdf',
        storeName = 'BikinPOS',
    } = options;

    const fmtCurrency = (v) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`;
    const fmtDate = (d) => new Date(d).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
    });
    const fmtTime = (d) => new Date(d).toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit',
    });

    try {
        // Use standard A4 format (same as working exportTableToPdf/exportReportToPdf)
        // to avoid triggering jsPDF v4's CSS color parser on custom formats
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const leftCol = 14;   // left column label position
        const rightCol = pageW - 14; // right column value position
        let y = 15;

        // Helper: manually center text without using { align: 'center' } option
        const centerText = (text, yy, fontSize) => {
            const textW = (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
            doc.text(text, (pageW - textW) / 2, yy);
        };
        const divider = (yy) => {
            doc.setDrawColor(180, 180, 180);
            doc.line(14, yy, pageW - 14, yy);
        };
        const thinDivider = (yy) => {
            doc.setDrawColor(210, 210, 210);
            doc.line(16, yy, pageW - 16, yy);
        };

        // ── Header ──
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        centerText(storeName, y, 16);
        y += 6;

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        centerText('Point of Sale System', y, 7);
        y += 4;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        centerText(data.invoice_number || 'RECEIPT', y, 9);
        y += 3;

        divider(y);
        y += 5;

        // ── Transaction Info ──
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const infoLines = [
            `Tanggal : ${fmtDate(data.created_at)}`,
            `Waktu   : ${fmtTime(data.created_at)}`,
            `Kasir   : ${data.user?.name || 'Walk-in'}`,
            `Pembayaran : ${data.payment_method || '-'}`,
        ];
        if (data.customer_name) {
            infoLines.push(`Pelanggan : ${data.customer_name}`);
        }
        infoLines.forEach((line) => {
            doc.text(line, leftCol, y);
            y += 3.5;
        });

        divider(y);
        y += 4.5;

        // ── Items Header ──
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Item', leftCol, y);
        doc.text('Qty', 80, y);
        doc.text('Harga', 105, y);
        doc.text('Subtotal', rightCol, y, { align: 'right' });
        y += 2.5;
        thinDivider(y);
        y += 3.5;

        // ── Items ──
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        const items = data.items || [];
        if (items.length === 0) {
            doc.setTextColor(150, 150, 150);
            doc.text('(No items)', leftCol + 4, y);
            y += 5;
            doc.setTextColor(0, 0, 0);
        } else {
            items.forEach((item) => {
                const name = item.product?.name || 'Unknown';
                const qty = item.quantity;
                const price = Number(item.selling_price);
                const subtotal = Number(item.subtotal);

                const displayName = name.length > 40 ? name.slice(0, 38) + '..' : name;
                doc.text(displayName, leftCol, y);
                y += 3.5;
                doc.text(`${qty}`, 80, y);
                doc.text(`Rp ${price.toLocaleString('id-ID')}`, 105, y);
                doc.text(`Rp ${subtotal.toLocaleString('id-ID')}`, rightCol, y, { align: 'right' });
                y += 5;

                if (y > 260) {
                    doc.addPage();
                    y = 15;
                }
            });
        }

        thinDivider(y);
        y += 4;

        // ── Totals ──
        doc.setFontSize(7.5);
        const totalRows = [
            { label: 'Subtotal', value: fmtCurrency(data.subtotal) },
        ];
        if (Number(data.discount) > 0) {
            totalRows.push({ label: 'Diskon', value: `-${fmtCurrency(data.discount)}` });
        }
        if (Number(data.tax) > 0) {
            totalRows.push({ label: 'Pajak', value: fmtCurrency(data.tax) });
        }

        totalRows.forEach((row) => {
            doc.setFont('helvetica', 'normal');
            doc.text(row.label, leftCol, y);
            doc.text(row.value, rightCol, y, { align: 'right' });
            y += 4;
        });

        // Total (bold, larger)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        divider(y - 0.5);
        y += 2;
        doc.text('TOTAL', leftCol, y);
        doc.text(fmtCurrency(data.total), rightCol, y, { align: 'right' });
        y += 7;

        // ── Footer ──
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        divider(y);
        y += 3.5;
        const thanks = 'Terima kasih sudah berbelanja!';
        centerText(thanks, y, 7);
        y += 3;
        centerText('www.bikinpos.com', y, 7);
        y += 3;
        centerText(`Dicetak: ${new Date().toLocaleString('id-ID')}`, y, 7);

        doc.save(filename);
        return true;
    } catch (error) {
        console.error('Receipt PDF export failed:', error);
        throw error;
    }
};
