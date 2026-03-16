import html2pdf from 'html2pdf.js';

export const generateElectricityReport = (bills, period = '') => {
  const dateStr = new Date().toLocaleDateString('bn-BD');
  
  const container = document.createElement('div');
  container.style.padding = '40px';
  container.style.fontFamily = "'Noto Sans Bengali', sans-serif";
  container.style.backgroundColor = 'white';
  container.style.color = '#1e293b';

  const totalUnits = bills.reduce((acc, b) => acc + ((b.currunit || 0) - (b.prevunit || 0)), 0);
  const totalAmount = bills.reduce((acc, b) => acc + (b.electricity || 0), 0);

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4f46e5; padding-bottom: 20px;">
      <h1 style="margin: 0; color: #4f46e5; font-size: 28px;">বিদ্যুৎ বিল রিপোর্ট</h1>
      <p style="margin: 5px 0; color: #64748b; font-size: 14px;">রিপোর্ট প্রকাশের তারিখ: ${dateStr}</p>
      ${period ? `<p style="margin: 5px 0; font-weight: bold; color: #1e293b;">সময়কাল: ${period}</p>` : ''}
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
      <thead>
        <tr style="background-color: #f1f5f9; border-bottom: 2px solid #e2e8f0;">
          <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">দোকান নং</th>
          <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">দোকানদারের নাম</th>
          <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0;">মোট ইউনিট</th>
          <th style="padding: 12px; text-align: right; border: 1px solid #e2e8f0;">টাকা (৳)</th>
        </tr>
      </thead>
      <tbody>
        ${bills.map(bill => {
          const units = (bill.currunit || 0) - (bill.prevunit || 0);
          return `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">${bill.shops?.shopnumber}</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">${bill.shops?.tenantname}</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">${units.toLocaleString('bn-BD')}</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${bill.electricity.toLocaleString('bn-BD')}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
      <tfoot>
        <tr style="background-color: #f8fafc; font-size: 16px;">
          <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold; border: 1px solid #e2e8f0;">সর্বমোট:</td>
          <td style="padding: 15px; text-align: center; font-weight: 800; color: #4f46e5; border: 1px solid #e2e8f0;">${totalUnits.toLocaleString('bn-BD')} ইউনিট</td>
          <td style="padding: 15px; text-align: right; font-weight: 800; color: #4f46e5; border: 1px solid #e2e8f0;">৳ ${totalAmount.toLocaleString('bn-BD')}</td>
        </tr>
      </tfoot>
    </table>

    <div style="margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
      <p style="margin: 0;">এটি একটি ডিজিটাল জেনারেটেড রিপোর্ট। Rent Manager Pro © ${new Date().getFullYear()}</p>
      <p style="margin: 5px 0 0 0;">আমাদের সাথে থাকার জন্য ধন্যবাদ!</p>
    </div>
  `;

  const opt = {
    margin: 10,
    filename: `Electricity_Summary_${dateStr.replace(/\//g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(container).save();
};
