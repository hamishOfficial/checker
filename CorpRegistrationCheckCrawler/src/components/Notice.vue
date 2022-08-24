<template>
  <q-card style="width: 560px; height:700px;">
    <q-card-section>
      <div class="text-h5">프로그램 설명</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <p style="padding:15px;">
        <b>'법인등기열람 크롤러'</b>는 사용자가 인터넷 등기소에서 간편하게 업체를 검색하여 등기를 열람할 수 있도록 보조하는 프로그램입니다.
        <b>'법인등기열람 크롤러'</b>가 보조하는 기능은 다음과 같습니다.<br/><br/>
        * 인터넷 등기소로 자동 접속하여, <b>결제하려는 법인 내역</b>을 정리합니다.<br/>
        * 법인 열람 출력을 통해 저장된 <b>PDF 파일의 이름이 기업의 상호와 일치</b>하도록 PDF 파일의 이름을 수정합니다.
      </p>
    </q-card-section>

    <q-card-section>
      <div class="text-h5">프로그램 사용 전 주의사항</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <p style="padding:15px;">
        * 크롤러가 제대로 작동하고 있지 않는 것 같다면, 다시 시도해주십시오.<br/>
        * 보안 프로그램을 우선 설치하셔야 합니다.<br/>
        * 크롤러 실행 도중 보안 프로그램을 설치해야 하는 경우가 발생한다면,<br/>
        * 크롤러 안에서 보안 프로그램 설치 후 다시 크롤러를 실행시켜야 합니다.<br/>
      </p>
    </q-card-section>

    <q-card-section>
      <div class="text-h5">프로그램 사용방법</div>
    </q-card-section>

    <q-card-section class="q-pt-none" style="margin:0px; padding:0px;">
      <ul>
        <li><b>1단계: 인터넷 등기소에 가입된 아이디와 비밀번호를 기입합니다.</b></li>
        <ul>
          <li style="color:red;">로그인 기록 및 브라우저 기록은 저장되지 않습니다.</li>
          <li>아이디가 없다면, 회원가입을 우선 진행하시기 바랍니다.</li>
          <li>회원가입 화면으로 바로 이동할 수 있는 링크가 존재합니다.</li>
          <br/>
        </ul>
        <li><b>1단계: 조회하려는 법인 등록번호로 이뤄진 엑셀 파일을 첨부합니다.</b></li>
        <ul>
          <li style="color:red;">엑셀에는 반드시 '법인 등록번호' 항목이 명시되어야 합니다.</li>
          <li>프로그램은 엑셀의 법인 등록번호 열을 찾아 작동합니다.</li>
          <br/>
        </ul>
        <li><b>1단계: '크롤링 실행' 버튼을 누릅니다.</b></li>
        <ul>
          <li style="color:red;">팝업된 브라우저가 자동으로 실행됩니다.</li>
          <li>결제 알림 이전까지 브라우저를 조작하지 않도록 주의합니다.</li>
          <br/>
        </ul>
        <li><b>1단계: 결제 후 법인 열람 출력물(.pdf)의 이름은 임의로 저장합니다.</b></li><br/>
        <li><b>2단계: 임의로 저장한 파일들을 드래그하여 프로그램에 업로드 합니다.</b></li>
        <ul>
          <li style="color:red;">업로드된 파일명은 [기업상호].pdf 형태로 변경됩니다.</li>
          <br/>
        </ul>
        <li><b>2단계: '파일명 변환' 버튼을 누릅니다.</b></li><br/>
        <li><b>2단계: 처리되지 않은 기업이 존재할 수 있습니다.</b></li>
        <ul>
          <li>인터넷 등기소와 완전히 호환되는 프로그램이 아닙니다.</li>
          <li>등기소 서버 문제 등으로 처리하지 않은 항목이 있을 수 있습니다.</li>
          <li style="color:red;">처리되지 않은 항목은 <b>C:\임시폴더\개별결제리스트.txt</b> 으로 저장되었습니다.</li>
          <li>해당 법인 등록번호는 Chrome 브라우저로 접속하여 개별 검색 부탁드립니다.</li>
          <br/>
        </ul>
        <li><b>3단계: `C:\\임시폴더`를 열어 정리본을 확인합니다.</b></li>
        <ul>
          <li>각 등기부등본의 기본정보를 정리해놓은 엑셀파일이</li>
          <li>`C:\\임시폴더\\등기부등본의 기업기본정보 리스트.xlsx`로 저장됩니다.</li>
          <br/>
        </ul>
        <br/>
      </ul>
    </q-card-section>

    <q-card-actions align="right" class="bg-white text-teal">
      <q-btn flat label="OK" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
export default {
  name: 'notice-component',
}
</script>

<style scoped>
ul {
  list-style: none;
}
ul li::before {
  content: "✅";
  display: inline-block;
  margin-right: 0.2rem;
}

ul ul li::before {
  content: "📌";
}
ul ul ul li::before {
  content: "🤷‍♀️";
}

li {
  margin-bottom: 3px;
  padding-right: 28px;
}
</style>