import html2pdf from 'html2pdf.js';

export const generateInvoice = (bill) => {
  const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const [year, month] = bill.month.split('-');
  const monthName = monthNames[parseInt(month) - 1];
  const dateStr = new Date().toLocaleDateString('bn-BD');
  const billDateStr = new Date(bill.created_at).toLocaleDateString('bn-BD');

  const container = document.createElement('div');
  container.style.padding = '0';
  container.style.fontFamily = "'Noto Sans Bengali', sans-serif";
  container.style.width = '794px'; // Exactly A4 width in pixels at standard DPI
  container.style.minHeight = '1123px'; // Exactly A4 height in pixels
  container.style.backgroundColor = 'white';
  
  container.innerHTML = `
    <div style="background: white; color: #1e293b; height: 1123px; position: relative; overflow: hidden; display: flex; flex-direction: column;">
      <!-- Modern Decorative Header Background -->
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 50px 40px; color: white;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="margin: 0; font-size: 34px; font-weight: 800; letter-spacing: -0.5px;">ভাড়ার রশিদ</h1>
            <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Rent Receipt & Invoice</p>
          </div>
          <div style="text-align: right;">
            <div style="background: rgba(255,255,255,0.15); padding: 10px 18px; border-radius: 12px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2);">
              <p style="margin: 0; font-size: 13px; opacity: 0.8;">ইনভয়েস নম্বর</p>
              <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 700;">#RM-${bill.shops.shopnumber}-${bill.month.replace('-', '')}</p>
            </div>
          </div>
        </div>
      </div>

      <div style="padding: 40px; flex-grow: 1;">
        <!-- Entity Details Section -->
        <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; margin-bottom: 40px;">
          <div>
            <p style="text-transform: uppercase; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 10px; letter-spacing: 1px;">বিল প্রাপক / Tenant Information</p>
            <div style="background: #f8fafc; padding: 18px; border-radius: 16px; border: 1px solid #e2e8f0;">
              <h2 style="margin: 0 0 6px 0; color: #0f172a; font-size: 22px;">${bill.shops.tenantname}</h2>
              <div style="color: #475569; font-size: 14px; line-height: 1.5;">
                <p style="margin: 0;">দোকান নং: <span style="color: #0f172a; font-weight: 600;">${bill.shops.shopnumber}</span></p>
                <p style="margin: 0;">ফোন: <span style="color: #0f172a; font-weight: 600;">${bill.shops.phone}</span></p>
              </div>
            </div>
          </div>
          <div style="text-align: right;">
             <p style="text-transform: uppercase; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 10px; letter-spacing: 1px;">তারিখ ও মাস / Date Details</p>
             <div style="padding: 15px 0;">
                <p style="margin: 0; font-size: 14px; color: #475569;">ভাড়ার মাস: <span style="color: #0f172a; font-weight: 700;">${monthName} ${year}</span></p>
                <p style="margin: 6px 0 0 0; font-size: 14px; color: #475569;">তৈরির তারিখ: <span style="color: #0f172a; font-weight: 600;">${dateStr}</span></p>
             </div>
          </div>
        </div>

        <!-- Stylish Table -->
        <div style="border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 700; color: #475569;">বিবরণ (Description)</th>
                <th style="padding: 16px 20px; text-align: center; font-size: 13px; font-weight: 700; color: #475569;">পাওনা তথ্য (Details)</th>
                <th style="padding: 16px 20px; text-align: right; font-size: 13px; font-weight: 700; color: #475569;">পরিমাণ (Amount)</th>
              </tr>
            </thead>
            <tbody style="color: #334155; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 16px 20px; font-weight: 600;">মাসিক দোকান ভাড়া</td>
                <td style="padding: 16px 20px; text-align: center; color: #94a3b8;">-</td>
                <td style="padding: 16px 20px; text-align: right; font-weight: 600;">৳ ${bill.rent.toLocaleString('bn-BD')}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
                <td style="padding: 16px 20px; font-weight: 600;">বিদ্যুৎ বিল</td>
                <td style="padding: 16px 20px; text-align: center; color: #94a3b8;">-</td>
                <td style="padding: 16px 20px; text-align: right; font-weight: 600;">৳ ${bill.electricity.toLocaleString('bn-BD')}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 16px 20px; font-weight: 600;">পানি বিল</td>
                <td style="padding: 16px 20px; text-align: center; color: #94a3b8;">-</td>
                <td style="padding: 16px 20px; text-align: right; font-weight: 600;">৳ ${bill.water.toLocaleString('bn-BD')}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
                <td style="padding: 16px 20px; font-weight: 600;">অন্যান্য চার্জ</td>
                <td style="padding: 16px 20px; text-align: center; color: #94a3b8;">-</td>
                <td style="padding: 16px 20px; text-align: right; font-weight: 600;">৳ ${(bill.othercharges || 0).toLocaleString('bn-BD')}</td>
              </tr>
              ${bill.previous_due > 0 ? `
              <tr style="color: #e11d48; background: #fff1f2;">
                <td style="padding: 16px 20px; font-weight: 700;">পূর্বের বকেয়া (Dues)</td>
                <td style="padding: 16px 20px; text-align: center;">-</td>
                <td style="padding: 16px 20px; text-align: right; font-weight: 700;">৳ ${bill.previous_due.toLocaleString('bn-BD')}</td>
              </tr>
              ` : ''}
            </tbody>
          </table>
        </div>

        <!-- Total Highlights -->
        <div style="margin-top: 30px; display: flex; justify-content: flex-end;">
          <div style="width: 280px; background: #4f46e5; color: white; padding: 20px; border-radius: 20px; box-shadow: 0 15px 20px -5px rgba(79, 70, 229, 0.2);">
            <p style="margin: 0; font-size: 13px; opacity: 0.8; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">মোট টাকার পরিমাণ</p>
            <h2 style="margin: 6px 0 0 0; font-size: 28px; font-weight: 800;">৳ ${bill.total.toLocaleString('bn-BD')}</h2>
          </div>
        </div>
      </div>

      <!-- Professional Footer -->
      <div style="padding: 30px 40px; border-top: 2px dashed #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
           <div style="color: #94a3b8; font-size: 11px; text-align: left;">
              <p style="margin: 0;">অফিস কপি - ডিজিটাল রেকর্ড</p>
              <p style="margin: 4px 0 0 0;">Rent Manager Pro © ${year}</p>
           </div>
           <div style="text-align: right;">
              <p style="margin: 0; color: #475569; font-weight: 600; font-size: 13px;">আমাদের সাথে থাকার জন্য ধন্যবাদ!</p>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 10px;">এটি একটি সংরক্ষিত ই-রশিদ।</p>
           </div>
        </div>
      </div>

      <!-- Decorative side accent -->
      <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: linear-gradient(to bottom, #4f46e5, #7c3aed);"></div>
    </div>
  `;

  const opt = {
    margin: 0,
    filename: `Invoice_${bill.shops.shopnumber}_${bill.month}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      letterRendering: true,
      logging: false,
      width: 794,
      height: 1123
    },
    jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
  };

  html2pdf().set(opt).from(container).save();
};

