<template>
    <v-card
        class="mx-auto"
        width="400"
        elevation="12"
    >
        <v-card-text class="text-h4 text-center">
            {{ bankName }}
        </v-card-text>
        <v-divider class="w-75 mx-auto"></v-divider>
        <v-card-text class="text-h1 text-center">
            {{ remainingBalance }}
        </v-card-text>
    </v-card>
</template>


<script>

export default {
    props: {
        'bankName': String,
        'remainingBalance':''
    }
}

</script>


