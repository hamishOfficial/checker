import { BrowserWindow, ipcMain } from 'electron';
import * as xlsx from 'xlsx';
import { Readable } from 'stream';
import firstHalfCrawler from './firstHalfCrawler';
import * as fs from 'fs';
import pdfParser from 'pdf-parse';
import path from 'path';

ipcMain.handle('manageInput', async (event, id: string, pw: string, inputFilePath: string[]) => {
  // xlsx 모듈이 제대로 import 되었는지 확인
  // [TEST] console.log(xlsx.version);

  // load 'stream' for stream support
  xlsx.stream.set_readable(Readable);

  // [TEST] console.log(inputFilePath);
  // [RESULT EXAMPLE] [ 'C:\\Users\\DESKTOP\\Desktop\\test.xlsx' ]

  for (let i = 0; i < inputFilePath.length; i++) {
    const companyList: string[] = [];

    // 로컬 파일로부터 읽고 추출하기
    const workbook = xlsx.readFile(inputFilePath[i]);

    // 각 시트별로 forEach문을 돌도록 하였으나, 실질적으로 시트는 1개 --> 순번 / 회사명
    workbook.SheetNames.forEach(async (sheetname: string) => {
      // [TEST] console.log(sheetname);
      // [RESULT EXAMPLE] Sheet1

      let rows: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);
      // [TEST] console.log(typeof JSON.stringify(rows), JSON.stringify(rows));

      rows.forEach((item) => {
        console.log(item);
        if (item.hasOwnProperty('법인 등록번호')) {
          item.법인등록번호 = item['법인 등록번호'];
          delete item['법인 등록번호'];
        }
        if (item.hasOwnProperty('등록번호')) {
          item.법인등록번호 = item['등록번호'];
          delete item['등록번호'];
        }
        companyList.push(item.법인등록번호);
      });

      console.log(companyList);

      await firstHalfCrawler(id, pw, companyList);

      for (let i=0; i<companyList.length; i++) {
        // companyList[i] = companyList[i].replace('등록번호', '').replace('-', '');
        companyList[i] = companyList[i].replace('등록번호', '');
      }

      // [TEST] console.log('METHOD: firstHalfCrawler Finished!');

      const directoryPath = `C:\\임시폴더`;
      const text = `${directoryPath}\\(삭제요망)임시파일.txt`;
      
      // directoryPath에 해당하는 폴더가 있는지 확인하고, 없는 경우 생성
      !fs.existsSync(directoryPath) && fs.mkdirSync(directoryPath);

      // 동기 쓰기
      fs.writeFileSync(text, companyList.toString());
      
      // await fs.writeFile('(삭제요망)임시파일.txt', companyList.toString(), (err)=>{
      //   console.error(err);
      // })
    });
  }
});

ipcMain.handle('convertFileName', async (event, inputFilePath: string[]) => {
    let requestArray: string[] = [];
    let responseArray: string[] = [];
    
    const directoryPath = `C:\\임시폴더`;
    const text = `${directoryPath}\\(삭제요망)임시파일.txt`;

    const dirname = path.dirname(inputFilePath[0]);

    if (fs.existsSync(text)) {
        const requestFile = fs.readFileSync(text, 'utf-8');
        const requestList = requestFile.toString();
        requestArray = requestList.split(',');

        for (let i=0; i<requestArray.length; i++) {
            requestArray[i] = requestArray[i];
        }
    }
    

    const excelArray = [['순번', '법인 등록번호', '상호', '1주의 금액', '발행할 주식의 총수', '발행 주식의 총수', '보통 주식']];
    const wb = xlsx.utils.book_new();

    for (let i=0; i<inputFilePath.length; i++) {
        let dataBuffer = fs.readFileSync(inputFilePath[i]);
        await pdfParser(dataBuffer).then(async function (data) {
            const dataArray = data.text.split("\n");
            // [TEST] console.log(dataArray);
            let filename: string = dataArray[6];
            filename = filename.slice(4, filename.length);
            fs.rename(inputFilePath[i], dirname+'\\'+filename+'.pdf', (err)=>{
                console.error(err);
            });
            // responseArray.push(dataArray[5].replace(/^[0-9]/g, '').replace('등록번호', '').replace('-', ''));
            responseArray.push(dataArray[5].replace(/^[0-9]/g, '').replace('등록번호', ''));

            /*
            순번 : excelArray.length+1
            법인등록번호 : dataArray[5].replace(/^[0-9]/g, '').replace('등록번호', '')
            상호 : filename
            1주의금액 : dataArray.find((item)=>item.startsWith('1주의 금액'))
            발행할주식의총수 : dataArray.find((item)=>item.startsWith('발행할 주식의 총수'))
            발행주식의총수 : dataArray.find((item)=>item.startsWith('발행주식의 총수'))
            보통주식 : dataArray.find((item)=>item.startsWith('보통주식'))
            */

            const 순번: string = (excelArray.length).toString();
            const 등록번호: string = dataArray[5].replace(/^[0-9]/g, '').replace('등록번호', '');
            const 상호: string = filename.toString();
            let 금액of1주: string = '';
            if (dataArray.find((item)=>item.startsWith('1주의 금액'))) {
              금액of1주 = (dataArray.find((item)=>item.startsWith('1주의 금액'))?.replace('1주의 금액금', '').replace('원', '').trim() as string)
            };
            let 발행할주식의총수: string = '';
            if (dataArray.find((item)=>item.startsWith('발행할 주식의 총수'))?.replace("발행할 주식의 총수", '')) {
              발행할주식의총수 = (dataArray.find((item)=>item.startsWith('발행할 주식의 총수'))?.replace("발행할 주식의 총수", '') as string);
              발행할주식의총수 = 발행할주식의총수.substr(0, 발행할주식의총수.indexOf('주'))
            }
            let 발행주식의총수: string = '';
            if (dataArray.find((item)=>item.startsWith('발행주식의 총수'))?.replace('발행주식의 총수', '').trim()) {
              발행주식의총수 = (dataArray.find((item)=>item.startsWith('발행주식의 총수 '))?.replace('발행주식의 총수', '').trim() as string);
              발행주식의총수 = 발행주식의총수.substr(0, 발행주식의총수.indexOf('주'));
            }
            // str.indexOf('주')
            let 보통주식: string = '';
            if (dataArray.find((item)=>item.startsWith('보통주식'))?.replace('보통주식', '').trim()) {
              보통주식 = (dataArray.find((item)=>item.startsWith('보통주식'))?.replace('보통주식', '').trim() as string);
              보통주식 = 보통주식.substr(0, 보통주식.indexOf('주'));
            }

            excelArray.push([순번, 등록번호, 상호, 금액of1주, 발행할주식의총수, 발행주식의총수, 보통주식]);

            // console.log(excelArray);
        });
    }

    const ws = xlsx.utils.aoa_to_sheet(excelArray);
    xlsx.utils.book_append_sheet(wb, ws, '등기부등본의 기업기본정보 리스트');
    await xlsx.writeFile(wb, 'C:\\임시폴더\\등기부등본의 기업기본정보 리스트.xlsx');

    if (fs.existsSync(text)) {
        requestArray = requestArray.filter(x=>!(responseArray.includes(x)));

        await fs.writeFile(`${directoryPath}\\개별결제리스트.html`, "# 다음 항목들에 대해서는 크롤러가 작동하지 않았습니다.<br/>"
        + "# 해당 법인 등록번호는 인터넷 등기소에 직접 접속하셔서 결제를 진행해주셔야 합니다.<br/>"
        + "# 결제되지 않은 항목은 C:\\임시폴더\\개별결제리스트.html 에서도 확인 가능합니다.<br/>"
        + "# (목록에 적힌 법인 등록번호가 없다면, 크롤러가 모든 항목을 처리한 것입니다.<br/>"
        + "==============================================================<br/><br/>"
        + requestArray.toString().split(',').join('<br/>'), (err)=>{
            console.error(err);
        });

        fs.unlinkSync(text);
    }

});

ipcMain.handle('readCompanyList', async ()=>{
  const directoryPath = `C:\\임시폴더`;

  if (!fs.existsSync(`${directoryPath}\\개별결제리스트.html`)) {
    return;
  }

  const mainWindow = new BrowserWindow({width: 800, height:800});
  mainWindow.loadURL(`file://${directoryPath}/개별결제리스트.html`);
});