import { CreateRecommendationData } from '../../src/services/recommendationsService';
import { faker } from '@faker-js/faker';

function recomendationsFactory(): CreateRecommendationData{
    return {
        name: faker.lorem.word(),
        youtubeLink: 'https://youtu.be/4Ukh9aQBzWc',
    }
}

function recomendationsFactoryArray(lenght: number): CreateRecommendationData[]{
    return Array.from({length: lenght}, () => recomendationsFactory());
}

export { recomendationsFactory, recomendationsFactoryArray };