<template lang="">
	<div
		class="tw:absolute tw:inset-0 tw:z-10 tw:flex tw:flex-col tw:items-center tw:justify-center tw:backdrop-blur-[1px] tw:bg-orange-100/25"
	>
		<q-spinner-tail color="green-14" size="4em" />
		<div class="text-subtitle2 text-green-10">Memproses data …</div>
	</div>

	<!-- inner loading must be on the end -->
	<!-- <q-inner-loading :showing="loading" color="red" size="6em">
			<q-spinner-tail />
		</q-inner-loading> -->
	<!-- <q-inner-loading
			:showing="true"
			label="Please wait..."
			label-class="text-teal"
			label-style="font-size: 1.1em"
		/> -->
</template>
<script>
export default {};
</script>
<style lang=""></style>
