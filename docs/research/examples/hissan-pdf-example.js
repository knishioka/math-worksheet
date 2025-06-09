// 筆算のPDF生成例（jsPDFとPDFKitを使用）

// ===== jsPDFの例 =====
// 注意: 実際の使用時は日本語フォントの読み込みが必要です

class HissanPDFGenerator {
    constructor() {
        // jsPDFインスタンスの初期化
        // const doc = new jsPDF();
        this.leftMargin = 20;
        this.topMargin = 40;
        this.digitWidth = 10;
        this.lineHeight = 8;
    }

    // たし算の筆算を生成
    generateAddition(doc, x, y, num1, num2) {
        const result = num1 + num2;
        const num1Str = num1.toString();
        const num2Str = num2.toString();
        const resultStr = result.toString();
        
        // 桁数を計算
        const maxDigits = Math.max(num1Str.length, num2Str.length, resultStr.length);
        
        // 繰り上がりの計算
        let carries = [];
        let carry = 0;
        for (let i = num1Str.length - 1, j = num2Str.length - 1; i >= 0 || j >= 0; i--, j--) {
            const digit1 = i >= 0 ? parseInt(num1Str[i]) : 0;
            const digit2 = j >= 0 ? parseInt(num2Str[j]) : 0;
            const sum = digit1 + digit2 + carry;
            carry = Math.floor(sum / 10);
            if (carry > 0 && (i > 0 || j > 0)) {
                carries.unshift(carry);
            } else {
                carries.unshift('');
            }
        }
        
        // 繰り上がりを表示
        doc.setFontSize(8);
        doc.setTextColor(255, 0, 0);
        for (let i = 0; i < carries.length; i++) {
            if (carries[i]) {
                doc.text(carries[i].toString(), 
                    x + (maxDigits - carries.length + i) * this.digitWidth + 5, 
                    y - 5);
            }
        }
        
        // 数値を表示
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // 1つ目の数
        doc.text(num1Str, 
            x + (maxDigits - num1Str.length) * this.digitWidth, 
            y);
        
        // 演算子と2つ目の数
        doc.text('+', x - 10, y + this.lineHeight);
        doc.text(num2Str, 
            x + (maxDigits - num2Str.length) * this.digitWidth, 
            y + this.lineHeight);
        
        // 横線
        doc.line(x - 15, y + this.lineHeight + 5, 
            x + maxDigits * this.digitWidth + 5, y + this.lineHeight + 5);
        
        // 答え
        doc.text(resultStr, 
            x + (maxDigits - resultStr.length) * this.digitWidth, 
            y + 2 * this.lineHeight + 5);
            
        return y + 3 * this.lineHeight + 10;
    }

    // ひき算の筆算を生成
    generateSubtraction(doc, x, y, num1, num2) {
        const result = num1 - num2;
        const num1Str = num1.toString();
        const num2Str = num2.toString();
        const resultStr = result.toString();
        
        const maxDigits = Math.max(num1Str.length, num2Str.length);
        
        // 繰り下がりの処理（簡略版）
        let borrowPositions = [];
        let tempNum1 = num1Str.split('').map(d => parseInt(d));
        let tempNum2 = num2Str.padStart(maxDigits, '0').split('').map(d => parseInt(d));
        
        for (let i = maxDigits - 1; i >= 0; i--) {
            if (tempNum1[i] < tempNum2[i]) {
                borrowPositions.push(i);
                tempNum1[i] += 10;
                if (i > 0) tempNum1[i - 1] -= 1;
            }
        }
        
        // 数値を表示
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // 1つ目の数（繰り下がりがある場合は処理）
        for (let i = 0; i < num1Str.length; i++) {
            const digit = num1Str[i];
            const xPos = x + (maxDigits - num1Str.length + i) * this.digitWidth;
            
            if (borrowPositions.includes(i - 1)) {
                // 繰り下がりで減った数字
                doc.setTextColor(150, 150, 150);
                doc.text(digit, xPos, y);
                doc.line(xPos - 2, y - 3, xPos + 7, y - 3); // 取り消し線
                
                // 新しい数字
                doc.setTextColor(0, 0, 255);
                doc.setFontSize(10);
                doc.text((parseInt(digit) - 1).toString(), xPos + 2, y - 5);
                doc.setFontSize(12);
            } else {
                doc.setTextColor(0, 0, 0);
                doc.text(digit, xPos, y);
            }
        }
        
        // 演算子と2つ目の数
        doc.setTextColor(0, 0, 0);
        doc.text('−', x - 10, y + this.lineHeight);
        doc.text(num2Str, 
            x + (maxDigits - num2Str.length) * this.digitWidth, 
            y + this.lineHeight);
        
        // 横線
        doc.line(x - 15, y + this.lineHeight + 5, 
            x + maxDigits * this.digitWidth + 5, y + this.lineHeight + 5);
        
        // 答え
        doc.text(resultStr, 
            x + (maxDigits - resultStr.length) * this.digitWidth, 
            y + 2 * this.lineHeight + 5);
            
        return y + 3 * this.lineHeight + 10;
    }

    // かけ算の筆算を生成
    generateMultiplication(doc, x, y, num1, num2) {
        const result = num1 * num2;
        const num1Str = num1.toString();
        const num2Str = num2.toString();
        const resultStr = result.toString();
        
        // 部分積を計算
        let partialProducts = [];
        for (let i = num2Str.length - 1; i >= 0; i--) {
            const digit = parseInt(num2Str[i]);
            const product = num1 * digit;
            partialProducts.push({
                value: product,
                shift: num2Str.length - 1 - i
            });
        }
        
        const maxDigits = Math.max(
            num1Str.length, 
            num2Str.length,
            ...partialProducts.map(p => p.value.toString().length + p.shift),
            resultStr.length
        );
        
        // 数値を表示
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // 1つ目の数
        doc.text(num1Str, 
            x + (maxDigits - num1Str.length) * this.digitWidth, 
            y);
        
        // 演算子と2つ目の数
        doc.text('×', x - 10, y + this.lineHeight);
        doc.text(num2Str, 
            x + (maxDigits - num2Str.length) * this.digitWidth, 
            y + this.lineHeight);
        
        // 横線
        doc.line(x - 15, y + this.lineHeight + 5, 
            x + maxDigits * this.digitWidth + 5, y + this.lineHeight + 5);
        
        // 部分積を表示
        let currentY = y + 2 * this.lineHeight + 5;
        for (let i = 0; i < partialProducts.length; i++) {
            const pp = partialProducts[i];
            const ppStr = pp.value.toString();
            doc.text(ppStr, 
                x + (maxDigits - ppStr.length - pp.shift) * this.digitWidth, 
                currentY);
            currentY += this.lineHeight;
        }
        
        // 部分積が2つ以上ある場合は横線を引く
        if (partialProducts.length > 1) {
            doc.line(x - 15, currentY - this.lineHeight + 5, 
                x + maxDigits * this.digitWidth + 5, currentY - this.lineHeight + 5);
            
            // 答え
            doc.text(resultStr, 
                x + (maxDigits - resultStr.length) * this.digitWidth, 
                currentY);
            currentY += this.lineHeight;
        }
        
        return currentY + 5;
    }

    // わり算の筆算を生成
    generateDivision(doc, x, y, dividend, divisor) {
        const quotient = Math.floor(dividend / divisor);
        const remainder = dividend % divisor;
        
        const dividendStr = dividend.toString();
        const divisorStr = divisor.toString();
        const quotientStr = quotient.toString();
        
        // 商を上に表示
        doc.setFontSize(12);
        doc.text(quotientStr, x + 30, y - 10);
        
        // 横線（商の下）
        doc.line(x + 25, y - 5, x + 30 + quotientStr.length * this.digitWidth, y - 5);
        
        // 除数
        doc.text(divisorStr, x, y + 5);
        
        // わり算の記号（かっこ）
        doc.moveTo(x + 20, y);
        doc.lineTo(x + 20, y + 10);
        doc.lineTo(x + 25, y + 10);
        doc.stroke();
        
        // 被除数
        doc.text(dividendStr, x + 30, y + 5);
        
        // 途中計算を表示（簡略版）
        let currentY = y + 15;
        let tempDividend = dividend;
        let digitIndex = 0;
        
        while (digitIndex < quotientStr.length) {
            const quotientDigit = parseInt(quotientStr[digitIndex]);
            const product = quotientDigit * divisor;
            
            // 引き算する数
            doc.text(product.toString(), x + 30 + digitIndex * this.digitWidth, currentY);
            currentY += this.lineHeight;
            
            // 横線
            doc.line(x + 25 + digitIndex * this.digitWidth, currentY - 5, 
                x + 50 + digitIndex * this.digitWidth, currentY - 5);
            
            // 差
            const diff = Math.floor(tempDividend / Math.pow(10, quotientStr.length - digitIndex - 1)) - product;
            if (digitIndex < quotientStr.length - 1) {
                const nextDigit = parseInt(dividendStr[digitIndex + 1] || '0');
                tempDividend = diff * 10 + nextDigit;
                doc.text(tempDividend.toString(), x + 30 + digitIndex * this.digitWidth, currentY);
            } else {
                // 余り
                doc.text(remainder.toString(), x + 30 + digitIndex * this.digitWidth, currentY);
            }
            
            currentY += this.lineHeight;
            digitIndex++;
        }
        
        // 余りの表示
        if (remainder > 0) {
            doc.text(`あまり ${remainder}`, x + 60, y - 10);
        }
        
        return currentY + 5;
    }

    // 手書きスペースを追加
    addHandwritingSpace(doc, x, y, width, height) {
        // 点線の枠
        doc.setDrawColor(150, 150, 150);
        doc.setLineDash([2, 2], 0);
        doc.rect(x, y, width, height);
        
        // テキスト
        doc.setFontSize(10);
        doc.setTextColor(200, 200, 200);
        doc.text('ここに計算を書いてください', x + width / 2, y + height / 2, { align: 'center' });
        
        // リセット
        doc.setLineDash([]);
        doc.setDrawColor(0, 0, 0);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
    }

    // サンプルPDFを生成
    generateSamplePDF() {
        // const doc = new jsPDF();
        
        // タイトル
        doc.setFontSize(16);
        doc.text('筆算練習プリント', 105, 20, { align: 'center' });
        
        let currentY = 40;
        
        // たし算
        doc.setFontSize(14);
        doc.text('1. たし算', this.leftMargin, currentY);
        currentY += 10;
        currentY = this.generateAddition(doc, this.leftMargin + 20, currentY, 234, 789);
        this.addHandwritingSpace(doc, this.leftMargin, currentY, 80, 30);
        currentY += 40;
        
        // ひき算
        doc.text('2. ひき算', this.leftMargin, currentY);
        currentY += 10;
        currentY = this.generateSubtraction(doc, this.leftMargin + 20, currentY, 500, 234);
        this.addHandwritingSpace(doc, this.leftMargin, currentY, 80, 30);
        currentY += 40;
        
        // かけ算
        doc.text('3. かけ算', this.leftMargin, currentY);
        currentY += 10;
        currentY = this.generateMultiplication(doc, this.leftMargin + 20, currentY, 123, 45);
        this.addHandwritingSpace(doc, this.leftMargin, currentY, 80, 40);
        currentY += 50;
        
        // わり算
        doc.text('4. わり算', this.leftMargin, currentY);
        currentY += 10;
        currentY = this.generateDivision(doc, this.leftMargin + 20, currentY, 128, 4);
        this.addHandwritingSpace(doc, this.leftMargin, currentY, 80, 40);
        
        // PDFを保存
        // doc.save('hissan-practice.pdf');
    }
}

// ===== PDFKitの例（Node.js環境用） =====
class HissanPDFKitGenerator {
    constructor() {
        // const PDFDocument = require('pdfkit');
        // this.doc = new PDFDocument();
        this.fontSize = 12;
        this.digitWidth = 20;
        this.lineHeight = 20;
    }

    // Grid形式でたし算を生成
    generateAdditionGrid(x, y, num1, num2) {
        const doc = this.doc;
        const result = num1 + num2;
        const digits1 = num1.toString().split('').map(d => parseInt(d));
        const digits2 = num2.toString().split('').map(d => parseInt(d));
        const resultDigits = result.toString().split('').map(d => parseInt(d));
        
        const maxDigits = Math.max(digits1.length, digits2.length, resultDigits.length);
        
        // グリッドを描画
        for (let i = 0; i <= maxDigits; i++) {
            // 縦線
            doc.moveTo(x + i * this.digitWidth, y - 20)
               .lineTo(x + i * this.digitWidth, y + 60)
               .stroke();
        }
        
        // 横線
        for (let i = 0; i <= 3; i++) {
            doc.moveTo(x, y + i * this.lineHeight)
               .lineTo(x + maxDigits * this.digitWidth, y + i * this.lineHeight)
               .stroke();
        }
        
        // 数字を配置
        doc.fontSize(this.fontSize);
        
        // 1つ目の数
        for (let i = 0; i < digits1.length; i++) {
            const xPos = x + (maxDigits - digits1.length + i) * this.digitWidth + this.digitWidth / 2;
            doc.text(digits1[i].toString(), xPos - 5, y + 5);
        }
        
        // 演算子
        doc.text('+', x - 15, y + this.lineHeight + 5);
        
        // 2つ目の数
        for (let i = 0; i < digits2.length; i++) {
            const xPos = x + (maxDigits - digits2.length + i) * this.digitWidth + this.digitWidth / 2;
            doc.text(digits2[i].toString(), xPos - 5, y + this.lineHeight + 5);
        }
        
        // 答え
        for (let i = 0; i < resultDigits.length; i++) {
            const xPos = x + (maxDigits - resultDigits.length + i) * this.digitWidth + this.digitWidth / 2;
            doc.text(resultDigits[i].toString(), xPos - 5, y + 2 * this.lineHeight + 5);
        }
        
        return y + 3 * this.lineHeight + 20;
    }

    // 練習問題セットを生成
    generatePracticeSet(problems) {
        const doc = this.doc;
        
        // ヘッダー
        doc.fontSize(20)
           .text('算数 筆算練習プリント', 50, 50, { align: 'center' });
        
        doc.fontSize(12)
           .text(`日付: ________________  名前: ________________`, 50, 80);
        
        let currentY = 120;
        let problemNumber = 1;
        
        problems.forEach(problem => {
            // 問題番号
            doc.fontSize(14)
               .text(`問題 ${problemNumber}`, 50, currentY);
            
            currentY += 20;
            
            // 問題に応じて適切な筆算を生成
            switch (problem.type) {
                case 'addition':
                    currentY = this.generateAdditionGrid(80, currentY, problem.num1, problem.num2);
                    break;
                // 他の演算も同様に実装
            }
            
            // 答え欄
            doc.fontSize(12)
               .text('答え: ________________', 250, currentY - 40);
            
            currentY += 40;
            problemNumber++;
            
            // ページ区切り
            if (currentY > 700) {
                doc.addPage();
                currentY = 50;
            }
        });
        
        // PDFを出力
        // doc.pipe(fs.createWriteStream('practice.pdf'));
        // doc.end();
    }
}

// 使用例
// const generator = new HissanPDFGenerator();
// generator.generateSamplePDF();

// Node.js環境での使用例
// const pdfKitGenerator = new HissanPDFKitGenerator();
// pdfKitGenerator.generatePracticeSet([
//     { type: 'addition', num1: 123, num2: 456 },
//     { type: 'addition', num1: 789, num2: 234 },
//     // ... 他の問題
// ]);

// エクスポート（モジュールとして使用する場合）
// module.exports = { HissanPDFGenerator, HissanPDFKitGenerator };