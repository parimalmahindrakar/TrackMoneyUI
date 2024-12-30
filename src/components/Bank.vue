<template>
    <v-card
        class="w-100"
        elevation="12"
    >
        <v-card-text class="text-lg-h3 text-md-h4 text-center">
            {{ bankName }}
        </v-card-text>
        <v-divider class="w-75 mx-auto"></v-divider>
        <v-card-text class="text-lg-h1 text-md-h3 text-center">
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


