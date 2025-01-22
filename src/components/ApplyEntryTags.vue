<template>
  <v-dialog v-model="getApplyEntryTagVisible" max-width="500">
    <template v-slot:default="{ isActive }">
      <v-card
        title="Update Entry Information"
        :class="{'bg-grey-darken-4': getIsDarkMode}"
      >
        <v-text-field
          class="mx-4"
          color="success"
          label="Modify the description"
          v-model="tagInfo.description"
        >
        </v-text-field>
        <v-select
          class="mx-4"
          color="success"
          label="Select the tag"
          v-model="selectedTags"
          :items="getEntryTags"
          multiple
        >
        </v-select>
        <v-divider class="w-75 mx-auto mb-3"></v-divider>
        <v-card-actions class="mx-2 mb-4">
          <v-spacer></v-spacer>
          <div class="d-flex justify-space-between w-100">
            <v-btn
              class="w-40"
              variant="outlined"
              color="success"
              :disabled="selectedTags.length == 0"
              @click="applyTagsSoft">
              Modify
            </v-btn>
            <v-btn class="w-40" variant="outlined" color="warning" @click="() => { setApplyEntryTagVisible(false) }">Cancel</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import { traceMyMoneyStore } from "@/stores/traceMyMoneyStore";
import { mapActions, mapState } from 'pinia'
import { toRaw } from "vue";

export default {
  data() {
    return {
      selectedTags: []
    }
  },
  props: ['tagInfo'],
  watch: {
    tagInfo(newVal, oldVal) {
      this.selectedTags = toRaw(newVal.entry_tags)
    },
  },
  computed: {
    ...mapState(traceMyMoneyStore, [
      "getApplyEntryTagVisible",
      "getEntryTags",
      "getIsDarkMode"
    ])
  },
  methods: {
    ...mapActions(traceMyMoneyStore, [
      "setApplyEntryTagVisible",
      "applyTagsToExpenseEntry"
    ]),
    applyTagsSoft() {
      const applyTagData = {
        "entry_id": this.tagInfo.ee_id,
        "expense_id": this.tagInfo.expenseId,
        "selected_tags": this.selectedTags,
        "description": this.tagInfo.description
      }
      this.applyTagsToExpenseEntry(applyTagData)
    }
  }
}
</script>
