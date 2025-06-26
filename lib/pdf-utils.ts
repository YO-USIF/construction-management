import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Element not found')
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

export function printElement(elementId: string) {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Element not found')
  }

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    throw new Error('Could not open print window')
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>طباعة التقرير</title>
      <style>
        body {
          font-family: 'Cairo', Arial, sans-serif;
          direction: rtl;
          text-align: right;
          margin: 20px;
          background: white;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: right;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2563eb;
          margin-bottom: 10px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        .stat-card {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
          background: #f9f9f9;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        .stat-label {
          color: #666;
          margin-top: 5px;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      ${element.innerHTML}
      <script>
        window.onload = function() {
          window.print();
          window.close();
        }
      </script>
    </body>
    </html>
  `)
  
  printWindow.document.close()
}
