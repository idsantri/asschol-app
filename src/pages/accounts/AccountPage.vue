<template>
    <CardPage>
        <CardHeader :title="titlePage" @on-reload="reload" :show-add="true" @on-add="handleAdd" />
        <q-card-section class="q-pa-sm" style="max-width: 1024px">
            <q-table
                flat
                bordered
                :rows="filteredAccounts"
                :columns="columns"
                row-key="id"
                :loading="loadingAccounts"
                :rows-per-page-options="[10, 25, 50, 100, 0]"
            >
                <template v-slot:body-cell-private="props">
                    <q-td :props="props">
                        <q-icon
                            :name="props.value ? 'sym_o_encrypted' : 'sym_o_encrypted_off'"
                            color="orange-10"
                            class="q-mr-sm"
                            size="1.5em"
                        />
                        {{ props.value ? 'Ya' : 'Tidak' }}
                    </q-td>
                </template>
                <template v-slot:body-cell-active="props">
                    <q-td :props="props">
                        <q-icon
                            :name="props.value ? 'check' : 'clear'"
                            color="orange-10"
                            class="q-mr-sm"
                            size="1.5em"
                        />
                        {{ props.value ? 'Ya' : 'Tidak' }}
                    </q-td>
                </template>
                <template v-slot:body-cell-id="props">
                    <q-td :props="props">
                        <q-btn
                            icon="edit"
                            flat
                            dense
                            color="orange-10"
                            :model-value="props.value"
                            @click="handleEdit(props.row)"
                        />
                    </q-td>
                </template>
                <template v-slot:body-cell-go="props">
                    <q-td :props="props">
                        <q-btn
                            icon="info"
                            flat
                            dense
                            color="orange-10"
                            :to="{
                                path: '/cash-flows',
                                query: {
                                    kelompok: QKelompok,
                                    rekening: props.row.slug,
                                },
                            }"
                        />
                    </q-td>
                </template>
            </q-table>
        </q-card-section>
        <QDialog v-model="dialog">
            <AccountForm
                @success-create="onCreate"
                @success-update="onUpdate"
                @success-delete="onDelete"
                :dataInputs="account"
            />
        </QDialog>
        <!-- {{ accounts }} -->
    </CardPage>
</template>

<script setup>
import { ref, computed } from 'vue';
import ArrayCrud from '@/models/ArrayCrud';
import AccountForm from '@/components/forms/AccountForm.vue';
import { useQueryState } from 'vue-url-state';
import { useAccountsStore } from '@/stores/accountsStore';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';

const QKelompok = useQueryState('kelompok', '');
const store = useAccountsStore();
const { accounts, isLoading: loadingAccounts } = storeToRefs(store);

const auth = useAuthStore();

const titlePage = computed(() => {
    const baseTitle = 'Daftar Rekening';
    if (QKelompok.value) {
        return `${baseTitle}: — ${QKelompok.value}`;
    }
    return baseTitle;
});

const dialog = ref(false);
const account = ref({});

const filteredAccounts = computed(() => {
    return accounts.value.filter(
        (a) => a.kelompok.toLowerCase() === QKelompok.value?.toLowerCase(),
    );
});

function reload() {
    return store.loadData({ kelompok: QKelompok.value });
}

const handleEdit = (acc) => {
    const data = JSON.parse(JSON.stringify(acc));
    account.value = {
        ...data,
    };
    // console.log('🚀 ~ handleEdit ~ data:', data);
    dialog.value = true;
};

const handleAdd = () => {
    account.value = {
        kelompok: auth.getKelompok,
        private: true,
        active: true,
    };
    dialog.value = true;
};

const onCreate = (data) => {
    accounts.value = ArrayCrud.create(accounts.value, data, 'first');
    dialog.value = false;
};

const onUpdate = (data) => {
    accounts.value = ArrayCrud.update(accounts.value, data.id, data);
    dialog.value = false;
};

const onDelete = (id) => {
    accounts.value = ArrayCrud.remove(accounts.value, id);
    dialog.value = false;
};

const columns = [
    {
        name: 'nama',
        label: 'Nama',
        field: 'nama',
        align: 'left',
        sortable: true,
    },
    {
        name: 'kelompok',
        label: 'Kelompok',
        field: 'kelompok',
        align: 'left',
        sortable: true,
    },
    {
        name: 'private',
        label: 'Private',
        field: 'private',
        align: 'left',
        sortable: true,
    },
    {
        name: 'active',
        label: 'Aktif',
        field: 'active',
        align: 'left',
        sortable: true,
    },
    {
        name: 'id',
        label: 'Edit',
        field: 'id',
        align: 'center',
    },
    {
        name: 'go',
        label: '!',
        field: 'id',
        align: 'center',
    },
];
</script>
<style lang=""></style>
