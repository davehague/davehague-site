<template>
    <section id="cofounder" class="py-20 bg-gray-50">
        <div class="container mx-auto px-6">
            <h2 class="text-3xl font-bold mb-8 text-gray-900">About You? (Perhaps we should talk...)</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <p class="text-lg mb-6 text-gray-700">
                        I'm on the lookout for a complementary co-founder.
                        While I bring the technical expertise to build great products, I need a business leader who
                        thrives on building
                        relationships, closing deals, and growing businesses.
                    </p>

                    <h3 class="text-xl font-semibold mb-4 text-gray-900">You might be someone who:</h3>
                    <ul class="list-disc list-inside space-y-2 mb-6 text-gray-700">
                        <li>Wants to be the face of a business</li>
                        <li>Gets energized by connecting with people and building networks</li>
                        <li>Has an entrepreneurial spirit and wants to create value in the world</li>
                        <li>Has more ideas than time (I know your pain!)</li>
                    </ul>

                    <p class="text-lg text-gray-700">
                        If you match the criteria above but not the strengths to the right, I still want to talk.
                        Most importantly, I'm looking for someone who I can spend time with- day in and day out.
                        Building a business is a tough job, and going it alone is no way to go. Let's go further,
                        together.
                    </p>
                </div>

                <div class="space-y-8 h-full flex flex-col">
                    <div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-900">Potential Strengths</h3>
                        <ul class="grid grid-cols-2 gap-2">
                            <li v-for="strength in cofounderStrengths" :key="strength"
                                class="bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 text-left">
                                {{ strength }}
                            </li>
                        </ul>
                    </div>
                    <ConnectWithMe />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const cofounderStrengths = [
    'Business Development',
    'Marketing Strategy',
    'Fundraising',
    'Product Management',
    'Partnership Building',
    'Go-to-Market Planning'
]
</script>