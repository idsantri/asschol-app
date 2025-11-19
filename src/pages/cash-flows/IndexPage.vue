<template lang="">
    <QCard>
        <CardHeader title="Arus Kas Organisasi" @on-reload="() => loadData(accountName)">
            <template #buttons>
                <q-btn
                    label="Tambah"
                    icon="add"
                    no-caps
                    outline
                    dense
                    class="q-px-sm"
                    @click="addRow"
                />
            </template>
        </CardHeader>
        <QCardActions class="q-pa-sm flex items-center justify-between q-gutter-y-sm">
            <q-select
                v-model="accountName"
                :options="optionsList"
                label="Pilih Nama Rekening"
                dense
                outlined
                clearable
                behavior="menu"
                class="full-width"
                style="max-width: 400px"
                :loading="loadingOptions"
            >
                <template v-slot:after>
                    <q-btn no-caps outline icon="sync" @click="getList" class="q-pa-sm" />
                </template>
            </q-select>
            <QInput
                v-model="accountSearch"
                dense
                outlined
                class="full-width"
                style="max-width: 400px"
                type="search"
                clearable
                label="Cari Arus Kas"
            />
        </QCardActions>
        <QCardSection class="q-pa-sm">
            <q-table
                :rows="filteredCashFlows"
                :loading="loadingData"
                flat
                bordered
                :rows-per-page-options="[10, 25, 50, 100, 0]"
                :columns="columns"
            >
                <template v-slot:body-cell-edit="props">
                    <q-td :props="props">
                        <q-btn
                            flat
                            color="orange-10"
                            icon="edit"
                            dense
                            @click="editRow(props.row)"
                        />
                    </q-td>
                </template>
            </q-table>
        </QCardSection>
        <QDialog v-model="showForm" persistent>
            <CashFlowForm
                @success-create="
                    (r) => {
                        accountName = r.account;
                        loadData(accountName);
                    }
                "
                @success-update="
                    (r) => {
                        accountName = r.account;
                        loadData(accountName);
                    }
                "
                @success-delete="loadData(accountName)"
                :data-inputs="cashFlow"
            />
        </QDialog>
    </QCard>
</template>
<script setup>
import CardHeader from '@/components/cards/CardHeader.vue';
import CashFlowForm from '@/components/forms/CashFlowForm.vue';
import CashFlow from '@/models/CashFlow';
import { formatDate } from '@/utils/date-operation';
import { computed, onMounted, ref, watch } from 'vue';
const optionsList = ref([]);
const loadingOptions = ref(false);
const cash_flows = ref([]);
const cashFlow = ref({});
const loadingData = ref(false);
const accountName = ref('');
const accountSearch = ref('');
const showForm = ref(false);

function editRow(row) {
    // console.log('edit row ', row.id);
    cashFlow.value = { ...row };
    showForm.value = true;
}

function addRow() {
    // console.log('add row');
    cashFlow.value = { account: accountName.value };
    showForm.value = true;
}

const filteredCashFlows = computed(() => {
    if (!accountSearch.value) {
        return cash_flows.value;
    }
    const result = cash_flows.value.filter((item) =>
        Object.values(item).some((val) =>
            String(val).toLowerCase().includes(accountSearch.value.toLowerCase()),
        ),
    );

    return result;
});

async function getList() {
    try {
        loadingOptions.value = true;
        optionsList.value = [];
        const data = await CashFlow.listAccount();
        optionsList.value = data.accounts;
    } catch (e) {
        console.log('error get account list ', e);
    } finally {
        loadingOptions.value = false;
    }
}

async function loadData(account) {
    if (!account) {
        cash_flows.value = [];
        return;
    }
    showForm.value = false;
    try {
        loadingData.value = true;
        const data = await CashFlow.getAll({ account: account });
        cash_flows.value = data.cash_flows;
    } catch (e) {
        console.log('error load cash flow data ', e);
    } finally {
        loadingData.value = false;
    }
}

onMounted(async () => {
    await getList();
});

watch(accountName, async (newVal, _oldVal) => {
    if (newVal) {
        await loadData(newVal);
    } else {
        cash_flows.value = [];
    }
});

const columns = [
    {
        name: 'transaction_date',
        label: 'Tanggal',
        field: 'transaction_date',
        align: 'left',
        format: (val) => formatDate(val, 'dd/MM/yyyy'),
        sortable: true,
    },
    {
        name: 'description',
        label: 'Deskripsi',
        field: 'description',
        align: 'left',
        sortable: false,
    },
    {
        name: 'income',
        label: 'Pemasukan',
        field: 'income',
        align: 'right',
        format: (val) =>
            val &&
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(val),
    },
    {
        name: 'expense',
        label: 'Pengeluaran',
        field: 'expense',
        align: 'right',
        format: (val) =>
            val &&
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(val),
    },
    {
        name: 'balance',
        label: 'Saldo',
        field: 'balance',
        align: 'right',
        format: (val) =>
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(val),
    },
    {
        name: 'edit',
        label: 'Edit',
        field: 'edit',
        align: 'center',
        sortable: false,
        // You can add a slot for custom rendering if needed
    },
];
</script>
