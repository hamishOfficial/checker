<template>
  <div id="q-app">
    <q-layout view="lHh Lpr fff">
      <q-page class="window-height window-width row justify-center items-center" style="background: linear-gradient(#8274c5, #5a4a9f)">
        <div class="column q-pa-lg">
          <div class="row">
            <q-card square class="shadow-24" style="width: 560px; height: 700px">
              
              <q-card-section v-if="state.readInputFlag" class="bg-deep-purple-7">
                <h4 class="text-h5 text-white q-my-md">{{ title }}&nbsp;
                  <button @click="needHelp" style="background-color:transparent; border:0px; color:white;"><span class="material-icons" style="font-size:1.2em">help</span></button>
                </h4>
                <span style="color:white; font-size:medium;">1단계: 결제를 위한 크롤링 브라우저 작동</span>
              </q-card-section>
              <q-card-section v-else class="bg-grey-9">
                <h4 class="text-h5 text-white q-my-md">{{ title }}&nbsp;
                  <button @click="needHelp" style="background-color:transparent; border:0px; color:white;"><span class="material-icons" style="font-size:1.2em">help</span></button>
                </h4>
                <span style="color:white; font-size:medium">2단계: 파일명 변경을 위한 출력물 업로드</span>
              </q-card-section>

              <q-dialog v-model="help">
                <!-- components/NoticeComponent.vue 에서 확인 가능 -->
                <!-- 사용방법에 대한 안내로, 물음표 아이콘을 눌렀을 때 팝업되는 모달창 -->
                <notice-component />
              </q-dialog>
              
              <q-card-section>
                <p v-if="state.readInputFlag" style="color: red; float: right;"><b>* 결제 알림 전까지 팝업창을 조작하시면 안됩니다.</b></p>
                <p v-else style="color:red; float:right;"><b>* 파일 이름 변환 후 직접 결제해야 하는 기업 목록을 확인 부탁드립니다.</b></p>

                <q-form v-if="state.readInputFlag" class="q-px-sm q-pt-xl" :key="key">
                  <q-input ref="idRef" square filled clearable v-model="id" type="text" label="인터넷 등기소 아이디" autofocus>
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>
                  <q-input square filled clearable v-model="pw" type="password" label="인터넷 등기소 비밀번호">
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                  </q-input>
                  <q-file clearable filled color="teal" accept=".xlsx" v-model="model" label="엑셀파일" multiple>
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" />
                    </template>
                  </q-file>
                  <q-btn type="submit" color="secondary" size="lg" @click="readInput" class="full-width" label="크롤링 실행" style="margin: 3px" />
                  <q-card-section class="text-center q-pa-sm">
                    <p class="text-grey-6">
                      인터넷 등기소 아이디가 없습니까?&nbsp;
                      <a href="http://www.iros.go.kr/PMainJ.jsp" target="_blank">인터넷 등기소 바로가기</a>
                    </p>
                  </q-card-section>
                </q-form>
                <q-form v-else class="q-px-sm q-pt-xl">
                  <q-file class="mybtn" clearable filled color="teal" accept=".pdf" v-model="convertFiles" label="열람을 위해 출력한 모든 파일을 업로드합니다." multiple>
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" />
                    </template>
                  </q-file>
                  <q-btn type="submit" color="secondary" size="lg" @click="convertFilename" class="full-width" label="파일 이름 변환 및 기본 정보 추출" style="margin: 3px" />
                </q-form>
                <br/>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import NoticeComponent from '../components/Notice.vue';
import { useQuasar } from 'quasar'

export default defineComponent({
  props: {},
  components: {
    NoticeComponent,
  },
  setup() {
    const $q = useQuasar()

    function showAlert (msg: string) {
      $q.dialog({
        title: '화면 전환 안내',
        message: msg
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    const key = ref(Date.now())
    const title = '법인 등기 열람 프로그램';
    let model = ref<File[]>();
    let convertFiles = ref<File[]>();
    let id = ref<string>();
    let pw = ref<string>();
    const state = reactive({
      readInputFlag: true,
    });
    // let notProcessedList = ref();
    let help = ref<boolean>(false);

    const readInput = async () => {
      state.readInputFlag = !state.readInputFlag;

      if (!model.value || model.value.length === 0) {
        showAlert('업로드된 파일이 없습니다. 파일 변환 화면으로 이동합니다.');
        id.value = '';
        pw.value = '';
        return;
      }

      const inputFilePath: string[] = [];
      const data = model.value;

      let userId = id.value;
      let userPw = pw.value;

      if (data) {
        data.forEach((item: File) => {
          inputFilePath.push((item as any).path);
        });
      }

      if (userId) {
        if (userPw) {
          // [TEST] console.log(userId.toString(), userPw.toString());
          showAlert('결제 알림 전까지 팝업창을 조작하시면 안됩니다!');
          await window.api.manageInput(userId.toString(), userPw.toString(), inputFilePath);
        }
      }

      // notProcessedList.value = '';
    };

    const convertFilename = async () => {
      state.readInputFlag = !state.readInputFlag;
      id.value = '';
      pw.value = '';
      model.value = [];
      const inputFilePath: string[] = [];
      if (!convertFiles.value) {
        showAlert('업로드된 파일이 없습니다. 크롤링 화면으로 이동합니다.');
        key.value = Date.now();
        return;
      }
      convertFiles.value.forEach((item: File) => {
        inputFilePath.push((item as any).path);
      });
      await window.api.convertFileName(inputFilePath);
      showAlert('파일명을 성공적으로 변환하였습니다.\n인터넷 등기소 사이트 상의 문제로 결제되지 않은 항목은\n`C:\\임시폴더\\개별결제리스트.txt`에서도 확인 가능합니다.');
      showAlert('법인 열람물들에 대한 정리본이 `C:\\임시폴더\\등기부등본의 기업기본정보 리스트.xlsx`으로 생성되었습니다.');

      // notProcessedList.value = await window.api.readCompanyList();
      window.api.readCompanyList();
    };

    const needHelp = () => {
      help.value = true;
    }

    return {
      id,
      pw,
      model,
      convertFiles,
      title,
      state,
      help,
      key,
      // notProcessedList,
      needHelp,
      readInput,
      convertFilename,
    };
  },
});
</script>
