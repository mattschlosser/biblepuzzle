<template>
    <div class="question container">
        <img style="width: 100%; margin: 0 auto;"  alt="" :src="question.img"/>
        <p style="margin-top: 20px;"><b>{{text}}</b></p>
        <template v-if="question.description">
            <p v-for="(q,i) in question.description.split('\n\n')" :key="i">{{q}}</p>
        </template>
        <p></p>
        <form class="form" @submit.prevent="$emit('ans', ans)">
            <!-- <ValidationProvider v-slot="v"> -->
                <div class="form-group">
                    <label for="ans">Enter your answer here:</label>
                    <input ref="i" name="ans" autofocus style="max-width: 50vw; margin: 0 auto;" class="form-control" v-model="ans" type="text"/>
                </div>
                <div v-if="error"  class='error'>Not quite. Try again</div>
            <!-- </ValidationProvider> -->
            <div style="margin-top: 20px">
                <button class="btn btn-primary" type="submit">Check Answer</button>
            </div>
        </form>
        <button class="btn btn-secondary" v-if="question.hint" style="margin: 20px 16px 0px;" @click="alert(question.hint)">
            I need a hint
        </button>
    </div>
</template>
<script>
import Swal from 'sweetalert2'
export default {
    props: {
        text: String,
        question: {
            type:  Object
        },
        error: Boolean
    },
    data() {
        return {
            ans: ''
        }
    },
    methods: {
        focus() {
            if (this.$refs.i)
                this.$refs.i.focus();
        },
        alert(q) {
            Swal.fire({text: q})
        }
    }
}
</script>
<style scoped>
.question {
    padding-bottom: 60vh;
}
.error {
    font-style:italic;
    color: #ff3333;
    font-size: 1em;
}
</style>