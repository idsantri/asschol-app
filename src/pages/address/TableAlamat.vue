<template lang="">
    <q-table
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="id"
        selection="single"
        v-model:selected="selected"
        :rows-per-page-options="[0]"
        virtual-scroll
        style="height: 75vh"
        :loading="loading"
    >
        <template v-slot:header="props">
            <q-tr :props="props">
                <q-th class="text-center" v-if="!noCheckBox">!</q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                </q-th>
                <q-th class="text-center">!</q-th>
            </q-tr>
        </template>
        <template v-slot:body="props">
            <q-tr :props="props">
                <td class="text-center" v-if="!noCheckBox">
                    <q-checkbox
                        v-model="props.selected"
                        dense
                        @update:model-value="$emit('onSelect', selected[0])"
                        checked-icon="sym_o_check_circle"
                        unchecked-icon="sym_o_radio_button_unchecked"
                    />
                </td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.value }}
                </q-td>
                <q-td class="text-center">
                    <q-btn
                        icon="edit"
                        dense
                        color="orange-10"
                        outline
                        @click="$emit('onEdit', props.row)"
                    />
                </q-td>
            </q-tr>
        </template>
    </q-table>
</template>
<script setup>
import { ref } from 'vue';

defineProps({
    rows: { type: Array },
    columns: { type: Array },
    loading: { type: Boolean, default: () => false },
    noCheckBox: { type: Boolean, default: () => false },
});
const selected = ref([]);
</script>
<style lang=""></style>
