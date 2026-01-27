<template lang="">
	<CardPage>
		<CardHeader title="Pengaturan Alamat" :showReload="false" />
		<q-card-section class="no-padding full-width row no-wrap justify-start items-start content-start scroll">
			<TableProvinsi class="q-ma-sm" style="min-width: 400px; max-width: 400px" @on-select="selectProvinsi" />
			<TableKabupaten
				class="q-ma-sm"
				style="min-width: 400px; max-width: 400px"
				@on-select="selectKabupaten"
				:provinsi_id="provinsi_id"
			/>
			<TableKecamatan
				class="q-ma-sm"
				style="min-width: 400px; max-width: 400px"
				@on-select="selectKecamatan"
				:provinsi_id="provinsi_id"
				:kabupaten_id="kabupaten_id"
			/>
			<TableDesa
				class="q-ma-sm"
				style="min-width: 400px; max-width: 400px"
				:provinsi_id="provinsi_id"
				:kabupaten_id="kabupaten_id"
				:kecamatan_id="kecamatan_id"
			/>
		</q-card-section>
	</CardPage>
</template>
<script setup>
import TableProvinsi from './DataProvinsi.vue';
import TableKabupaten from './DataKabupaten.vue';
import TableKecamatan from './DataKecamatan.vue';
import TableDesa from './DataDesa.vue';
import { ref } from 'vue';

const provinsi_id = ref('');
const kabupaten_id = ref('');
const kecamatan_id = ref('');

function selectProvinsi(v) {
	provinsi_id.value = v?.id ?? '';
	kabupaten_id.value = '';
	kecamatan_id.value = '';
}

function selectKabupaten(v) {
	kabupaten_id.value = v?.id ?? '';
	kecamatan_id.value = '';
}

function selectKecamatan(v) {
	kecamatan_id.value = v?.id ?? '';
}
</script>
<style lang=""></style>
