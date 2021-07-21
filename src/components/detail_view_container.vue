<template>
    <v-list-item>
                <v-list-item-content>
                <v-list-item-title>{{title}}</v-list-item-title>
                <v-list-item-subtitle
                    >{{data}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
</template>

<script>
export default {
    name:'detail_view_container',
    props:['title', 'data']
}
</script>

<style scoped>
.v-list-item__title{
    color: #2dff5b;
}
.v-list-item__subtitle{
    color: rgb(255, 255, 255) !important;
}
</style>