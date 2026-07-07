<template>
    <CardPage>
        <CardHeader title="Catatan Kegiatan" :show-reload="false"> </CardHeader>
        <q-card-section class="q-pa-sm" style="max-width: 1024px">
            <QCard flat bordered>
                <QCardSection class="q-px-sm q-pt-sm q-pb-none">
                    <ActivityHeader :activity="activity" />
                </QCardSection>
                <ActivityNoteForm
                    :dataInputs="{ activity_id: activity.id, ...note }"
                    @successDelete="$router.back()"
                    @successSubmit="$router.back()"
                />
            </QCard>
        </q-card-section>
    </CardPage>
</template>
<script setup>
import ActivityNoteForm from '@/components/forms/ActivityNoteForm.vue';
import ActivityHeader from '../activities/ActivityHeader.vue';

const { note, activity } = history.state;
// console.log(activity);
</script>
<style lang=""></style>
