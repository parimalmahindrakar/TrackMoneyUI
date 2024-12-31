<template>
  <v-dialog v-model="getApplyEntryTagVisible" max-width="500">
    <template v-slot:default="{ isActive }">
      <v-card :title="`${tagInfo.description}`">
        <v-select
          class="mx-4"
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
              color="primary"
              :disabled="selectedTags.length == 0"
              @click="applyTagsSoft">
              Apply tags
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
      "getEntryTags"
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
        "selected_tags": this.selectedTags
      }
      this.applyTagsToExpenseEntry(applyTagData)
    }
  }
}
</script>
