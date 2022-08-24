import puppeteer from 'puppeteer';
import * as fs from 'fs';
import { ClosePopup } from 'quasar';

function delay(time: number) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

const firstHalfCrawler = async (id: string, pw: string, companyList: string[]) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: [
                '--window-size=1080,1080',
            ],
        });
       
        const page = await browser.newPage();
        await page.setViewport({
            width: 1080,
            height: 1080,
        })

        // 팝업 무시
        page.on('popup', async (popup)=>{
            console.log(popup);
            if (popup) {
                await popup.waitForSelector('#oneDayNotOpen');
                await popup.evaluate(()=>{
                    (document.querySelector('#oneDayNotOpen') as any).click();
                });
                console.log('팝업창을 블록하였습니다.');
            }
        });

        // 다이얼로그 무시
        page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.dismiss();
        });
        
        
        // 인터넷 등기소 접속
        await page.goto('http://www.iros.go.kr/PMainJ.jsp', {
            waitUntil: 'networkidle2'
        });

        // 로그인
        const idInputElement = await page.$('#id_user_id')
        if(idInputElement) {
            await page.evaluate((tmpId, tmpPw)=>{
                (document.querySelector('#id_user_id') as HTMLInputElement).value = tmpId;
                (document.querySelector('#password') as HTMLInputElement).value = tmpPw;        
            }, id, pw);
            await delay(400);
            await page.$eval('#leftS > div:nth-child(2) > form > div.id_pw > ul > li.mt05 > a', elem=>(elem as any).click());
            // 로그인 완료 대기
            await page.waitForNavigation({
                waitUntil: 'networkidle2'
            });
        }

        // 법인 열람 페이지 이동 후 등록번호 방식 선택
        await page.goto('http://www.iros.go.kr/ifrontservlet?cmd=IISUGetCorpFrmCallC', {
            waitUntil: 'networkidle2'
        });
        
        // %% 수정해야 하는 부분 %%
        for(let i=0; i<companyList.length; i++) {
            // frmaeHandleInput은 등록번호를 입력하고 검색 버튼을 누름
            const frameHandleInput = await page.$("iframe[id='inputFrame']");
            const frame1 = await frameHandleInput?.contentFrame();
            if(!frame1) throw 'not exist frame1'
            
            await delay(200);

            await page.evaluate(() => {
                window.scrollTo(0, 0);
            });

            await frame1.$eval('#tab3 a', elem=>(elem as any).click());
            await frame1.type('#SANGHO_NUM', companyList[i]);
            await frame1.$eval('#searchArea > form:nth-child(1) > div > div > div > div > fieldset > div > table > tbody > tr:nth-child(9) > td.btn > button', elem=>(elem as any).click());

            await delay(700);
            await page.evaluate(() => {
                window.scrollTo(0, 0);
            });

            // 사업자 등록 번호로 검색한 다음 가져가야 하는 액션
            await page.mouse.click(979, 820, {delay: 400});
            await page.mouse.click(979, 820, {delay: 400});
            await page.mouse.click(979, 820, {delay: 400});

            await delay(800);
            await page.evaluate( () => {
                window.scrollBy(0, window.innerHeight);
            });

            await page.mouse.click(978, 700, {delay: 400});
            await page.mouse.click(978, 700, {delay: 400});
            await page.mouse.click(978, 700, {delay: 400});
            
            await delay(500);

            await page.evaluate( () => {
                window.scrollBy(0, window.innerHeight);
            });
            await page.mouse.click(973, 805, {delay: 400});
            await page.mouse.click(973, 936, {delay: 400});
            
            await delay(1200);

            await page.evaluate( () => {
                window.scrollBy(0, window.innerHeight);
            });

            await page.mouse.click(973, 767, {delay: 400});
            await page.mouse.click(973, 767, {delay: 400});
            
            await delay(500);

            await page.evaluate( () => {
                window.scrollBy(0, window.innerHeight);
            });

            await page.mouse.click(970, 805, {delay: 400});
            await page.mouse.click(970, 805, {delay: 400});
            
            await delay(700);

            await page.evaluate(() => {
                window.scrollTo(0, 0);
            });
        }
        
        // 꺼지기 전에 화면 대기
        await page.evaluate(async() => {
            alert('현재 창에서 일괄 결제를 진행해주시기 바랍니다.\n보안 프로그램의 경우, 다운로드 폴더에서 찾아 실행하시기 바랍니다.');
        });
    }
    catch(err) {
        console.error(err);
    }
};

export default firstHalfCrawler;