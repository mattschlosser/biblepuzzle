 <template>
    <div>
        <div class="container" v-if="!loading">
            <div>
                <img style="margin: 2rem 0 0 0;" src="/images/logo.png">
                <h1 style="padding: 60px;">Bible Puzzle Adventure</h1>
            </div>
            <transition-group
                name="fade"
                mode="out-in"
                @after-enter="() => $refs.q.focus()"
            >
                <div v-if="questions[question]" :key="question">
                <h4 style="margin-bottom: 20px;">Question {{ Number(question)+1 }}</h4>
                <question ref="q" :error="error"   :question="questions[question]" :text="questions[question].question" @ans="checkAns"/>
                </div>
                <div v-else :key="-1" style="padding-top: 15px; margin-top: 50px">
                    Congrats! You've made it to the end of the journey. If you'd like to learn more, <a href="http://ivcfuofa.com">visit our website</a>
                </div>
            </transition-group>
        </div>
        <div v-if='!questions[question]'>
            <button class="btn btn-secondary" @click="reset" style="margin-top: 20px">Try Again</button>
        </div>
    </div>
</template>
<script>
import Swal from 'sweetalert2'
import firebase from 'firebase/app'
import 'firebase/database'
import question from './Question'
export default {
    created() {
        firebase.database().ref('/questions').orderByKey().on('value', snapshot => {
            this.loading = false;
            let obj = snapshot.val()
            this.questions = Object.keys(obj).map(e => obj[e])
        })
    },
    components: {
      question, 
    },
    data() {
      return {
        question: localStorage.question || 0,
        error: false,
        questions: [],
        loading: true
      }
    },
    watch: {
      question: {
        handler(q) {
          // store question in memory so if user refreshes page, they don't lose location
          localStorage.question = q
        }, 
        immediate: true
      }
    }, 
    methods: {
     async checkAns(ans) {
        this.error = false;
        let {answers, question, questions} = this;
        if (ans == questions[question].ans) {
          // alert("Correct");
          this.question++;
        } else {
          this.error = true
          // Swal.fire({text: "Not quite! Try again",type: "error"});
        }
      },
      reset() {
        this.question = 0
      }
    },
  }
  </script>
  <style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 500ms;
  }
  .fade-enter-active {
    transition-delay: 500ms
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  a {
    color: #9999ff
  }
  </style>