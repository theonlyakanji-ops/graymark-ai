/**
 * Clean client-side print & PDF export generator
 */
export function exportAnalysisToPDF(title, contentHtml) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download your PDF report.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: 'Inter', system-ui, sans-serif;
            padding: 40px;
            color: #2C1E16;
            background: #FAF7F2;
            line-height: 1.6;
          }
          h1 { color: #3D2817; border-bottom: 2px solid #E6DED6; padding-bottom: 10px; }
          .badge { display: inline-block; padding: 4px 10px; background: #F5EFEB; border: 1px solid #E6DED6; border-radius: 4px; font-size: 12px; margin-bottom: 15px; }
          .score-box { background: #FFFFFF; border: 1px solid #E6DED6; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
          .score-num { font-size: 36px; font-weight: bold; color: #3D2817; }
          .section { background: #FFFFFF; border: 1px solid #E6DED6; padding: 20px; border-radius: 8px; margin-bottom: 15px; }
          ul { margin-left: 20px; }
        </style>
      </head>
      <body>
        <h1>AI Career Coach Report: ${title}</h1>
        <div className="badge">Generated on ${new Date().toLocaleDateString()}</div>
        ${contentHtml}
        <script>
          setTimeout(() => {
            window.print();
          }, 500);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
