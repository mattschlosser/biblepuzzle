<template>
    <div class="container" v-if="authed" style="padding-top: 50px;">
        <table class="table table-responsive">
            <thead><th>Question</th><th>Description</th><th>img</th><th>Hint</th><th>Answer</th><th>Actions</th></thead>
            <tr v-for="(question,id) in questions" :key="question.id">
                <!-- <td>{{id}}</td> -->
                <td>{{question.question}}</td>
                <td><p v-for="(q,i) in question.description.split('\n\n')" :key="i">{{q}}</p></td>
                <td>{{question.img}}</td>
                <td>{{question.hint}}</td>
                <td>{{question.ans}}</td>
                <td>
                    <a href="#edit" class="btn btn-sm btn-block btn-primary" @click="edit(id)">Edit</a>
                    <button class="btn btn-sm btn-block btn-danger" @click="remove(id)">Remove</button>
                </td>
            </tr>
        </table>
        <a name="edit"/>
        <form class="form" @submit.prevent="upload">
            <div class="form-group">
                <label for="question">Question*</label>
                <input class="form-control" type="text" v-model="question" name="question" required/>
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea class="form-control" type="text" v-model="description" name="description"></textarea>
            </div>
            <div class="form-group">
                <label for="img">Image URL</label>
                <input class="form-control" type="url" placeholder="http://example.com/img.png" v-model="img" name="img"/>
            </div>
            <div class="form-group">
                <label for="hints">Hint</label>
                <input class='form-control' type="text" v-model="hint" />
            </div>
            <div class="form-group">
                <label for="ans">Answer*</label>
                <input class="form-control" required type="text" v-model="ans" name="ans"/>
            </div>
            <div class="form-group">
                <button :disabled="loading" class="btn btn-primary form-control" type="submit">{{loading ? id ? "Editing" : "Adding..." : id ? "Edit Question" : "Add Question"}}</button>
            </div>
        </form>
        <div class="footer" style="padding-bottom: 20px">
            <button type="button" class="btn btn-secondary" @click.prevent="logout">Logout </button>
        </div>
    </div>
    <div class="container" v-else style="padding-top: 50px;"> 
        <p>You must be logged in to view this page</p>
        <div style="max-width: 50vw; margin: 0 auto;">
            <form class="form" @submit.prevent="login">
                <div v-if="error" class="alert alert-danger">
                    Could not log you in. 
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input class="form-control" type='email' required v-model="email"/>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input class="form-control" type='password' required v-model="password"/>
                </div>
                <div class="form-group">
                    <button :disabled="loading" type="submit" class="btn btn-primary form-control">{{loading ? "Logging In" : "Login" }}</button>
                </div>
                <a href="javascript:;" @click.stop="forgotPassword">Forgot Password?</a><br/><br/>
                
                <router-link to="/">
                    Back to quiz
                </router-link><br/>
            </form>
        </div>
    </div>
</template>
<script>
import Swal from 'sweetalert2'
import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'
export default {
    created() {
        firebase.database().ref('/questions').on('value', snapshot => {
            this.questions = snapshot.val()
        })
    },
    data() {
        return {
            email: '',
            password: '',
            question: '',
            questions: [],
            description: '',
            img: '',
            hint: '',
            ans: '',
            authed: firebase.auth().currentUser,
            error: false,
            loading: false,
            id: null
        }
    },
    methods: {
        edit(id) {
            let {question, description, hint, img, ans} = this.questions[id]
            this.question = question || '';
            this.description = description || '';
            this.hint = hint || '';
            this.img = img || '';
            this.ans = ans || '';
            this.id = id || '';
        }, 
        logout() {
            firebase.auth().signOut()
            this.authed = false
        },
        login() {
            this.loading = true
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(e => {
                this.authed = firebase.auth().currentUser
            }).catch(e => {
                this.error = e
            }).finally(e => {
                this.loading = false
            })
        },
        async remove(id) {
            let res = await Swal.fire({text: "Are you sure?" , showCancelButton: true, type: "danger"})
            if (!res.value) return;
            firebase.database().ref(`/questions/${id}`).remove()
        },
        resetForm() {
            this.question = '',
            this.description = '',
            this.img = '',
            this.ans = '',
            this.hint = ''
            this.loading = false
            this.id = null
        },
        upload() {
            // get a new question ref
            let {question, description, hint, img, ans, id} = this;
            let ref;
            if (!id) {
                ref = firebase.database().ref('/questions').push();
            } else {
                ref = firebase.database().ref(`/questions/${id}`)
            }
            this.loading = true;
            ref.update({
                question,
                description,
                img,
                hint,
                ans
            }).then(this.resetForm)
        },
        async forgotPassword() {
            let res = await Swal.fire({
                text : "Enter your email",
                input: 'email', 
            })
            if (!res.value) return;
            firebase.auth().sendPasswordResetEmail(res.value).then(e => Swal.fire("Email sent")).catch(e => Swal.fire("An error occured"))
        }
    }
}
</script>
<style scoped>
.table tr td, .table th {
    color: white
}
</style>