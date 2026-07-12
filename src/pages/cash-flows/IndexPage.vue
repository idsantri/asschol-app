<template>
    <CardPage>
        <CardHeader
            :title="titlePage"
            @on-reload="null"
            :show-reload="false"
            :show-add="true"
            @on-add="handleAdd"
            :disable-add="!account"
        />

        <q-card-section
            class="q-pa-sm tw:grid tw:grid-cols-1 tw:gap-2 tw:w-full tw:sm:flex tw:sm:items-center tw:sm:justify-between bg-orange-1"
        >
            <InputSelectArray
                v-model="QKelompok"
                url="kelompok-koordinasi"
                label="Pilih Kelompok"
                class="tw:w-full tw:sm:flex-1 tw:sm:max-w-md"
            />
            <q-select
                v-model="QAccount"
                :options="optionsAccount"
                label="Daftar Rekening Aktif"
                dense
                outlined
                clearable
                behavior="menu"
                class="tw:w-full tw:sm:flex-1 tw:sm:max-w-md"
                :loading="loadingAccounts"
                option-value="slug"
                option-label="nama"
                emit-value
                map-options
                :disable="!QKelompok"
            >
                <template v-slot:after>
                    <q-btn
                        no-caps
                        outline
                        :color="!!QKelompok ? 'orange-10' : ''"
                        :glossy="!!QKelompok"
                        icon="sync"
                        @click="() => loadAccounts(QKelompok)"
                        class="q-pa-sm"
                        :disable="!QKelompok"
                    />
                    <q-btn
                        no-caps
                        outline
                        color="orange-10"
                        glossy
                        icon="settings"
                        :to="{
                            path: '/accounts',
                            query: { kelompok: auth.getKelompok },
                        }"
                        class="q-pa-sm"
                    />
                </template>
            </q-select>
            <q-input
                class="tw:w-full tw:sm:flex-1 tw:sm:max-w-md"
                borderless
                dense
                debounce="300"
                v-model="searchModel"
                placeholder="Cari"
                outlined
                clearable
                label="Cari Arus Kas"
            >
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </q-card-section>

        <q-card-section class="q-pa-sm">
            <q-table
                flat
                bordered
                :rows="cashFlows"
                :columns="columns"
                row-key="id"
                :loading="lodCashFlow"
                :rows-per-page-options="[10, 25, 50, 100, 0]"
                :filter="searchModel"
                no-data-label="Tidak ada data untuk ditampilkan"
                no-results-label="Data tidak ditemukan"
            >
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
            </q-table>
        </q-card-section>
        <QDialog v-model="dialog">
            <CashFlowForm
                :dataInputs="cashFlow"
                :kelompok="QKelompok"
                @success-create="() => loadCashFlows(QAccount)"
                @success-update="() => loadCashFlows(QAccount)"
                @success-delete="() => loadCashFlows(QAccount)"
            />
        </QDialog>
    </CardPage>
</template>
<script setup>
import { ref, watch, computed } from 'vue';
import InputSelectArray from '@/components/forms/inputs/InputSelectArray.vue';
import CashFlowForm from '@/components/forms/CashFlowForm.vue';
import CashFlow from '@/models/CashFlow';
import { formatDate } from '@/utils/date-operation';
import { useQueryState } from 'vue-url-state';
import { useAccountsStore } from '@/stores/accountsStore';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';

const store = useAccountsStore();
const { accounts, isLoading: loadingAccounts } = storeToRefs(store);
const auth = useAuthStore();
const searchModel = ref('');
const QKelompok = useQueryState('kelompok', '');
const QAccount = useQueryState('rekening', '');

const dialog = ref(false);
const cashFlows = ref([]);
const cashFlow = ref({});
const lodCashFlow = ref(false);

const titlePage = computed(() => {
    const baseTitle = 'Arus Kas';
    if (QKelompok.value) {
        return `${baseTitle} —  ${QKelompok.value?.toUpperCase() || ''}`;
    }
    return baseTitle;
});

const optionsAccount = computed(() => {
    return accounts.value.filter(
        (a) => a.active && a.kelompok.toLowerCase() === QKelompok.value?.toLowerCase(),
    );
});

const account = computed(() => {
    return optionsAccount.value.find((a) => a.slug == QAccount.value);
});

function loadAccounts(kelompok) {
    return store.loadData({ kelompok });
}

watch(QKelompok, async (kelompok) => {
    if (kelompok) {
        const filtered = accounts.value.filter(
            (a) => a.kelompok.toLowerCase() == kelompok.toLowerCase(),
        );
        // console.log('🚀 ~ scoped:', scoped);
        if (!filtered.length) {
            await loadAccounts(kelompok);
        }
    }
    QAccount.value = '';
});

watch(
    QAccount,
    async (rekening) => {
        cashFlows.value = [];
        if (!rekening) return;
        await loadCashFlows(rekening);
    },
    { immediate: true },
);

async function loadCashFlows(rekening) {
    dialog.value = false;
    try {
        lodCashFlow.value = true;
        const res = await CashFlow.getAll({ rekening });
        if (res && res.cash_flows) {
            cashFlows.value = res.cash_flows;
        }
    } catch (err) {
        console.error('🚀 ~ loadCashFlows ~ err:', err);
    } finally {
        lodCashFlow.value = false;
    }
}

const handleAdd = () => {
    cashFlow.value = {
        rekening: QAccount.value,
        rekening_nama: account.value.nama,
    };
    dialog.value = true;
};

const handleEdit = (obj) => {
    cashFlow.value = {
        ...obj,
        rekening: QAccount.value,
        rekening_nama: account.value.nama,
    };
    dialog.value = true;
};

const columns = [
    {
        name: 'tgl_transaksi',
        align: 'left',
        label: 'Tanggal',
        field: 'tgl_transaksi',
        format: (val) => formatDate(val, 'dd-MM-yyyy'),
        sortable: true,
    },
    {
        name: 'keterangan',
        align: 'left',
        label: 'Keterangan',
        field: 'keterangan',
        sortable: true,
    },
    {
        name: 'masuk',
        align: 'right',
        label: 'Masuk',
        field: 'masuk',
        format: (val) =>
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(val),
        sortable: true,
    },
    {
        name: 'keluar',
        align: 'right',
        label: 'Keluar',
        field: 'keluar',
        format: (val) =>
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(val),
        sortable: true,
    },
    {
        name: 'saldo',
        align: 'right',
        label: 'Saldo',
        field: 'saldo',
        format: (val) =>
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(val),
        sortable: true,
    },
    {
        name: 'atas_nama',
        align: 'left',
        label: 'Atas Nama',
        field: 'atas_nama',
        sortable: true,
    },
    {
        name: 'id',
        align: 'center',
        label: 'Edit',
        field: 'id',
    },
];
</script>
<style lang=""></style>
