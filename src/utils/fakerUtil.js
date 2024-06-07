import {fakerDE as faker} from '@faker-js/faker'

export const generateProduct = (category) =>{
    return {
        id:faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description:faker.commerce.productDescription(),
        price:faker.commerce.price,
        code:faker.string.uuid(),
        status:true,
        stock:faker.number.int({min:0,max:100}),
        category:faker.definitions.word.noun[category],
        thumbnail:faker.image.url()
    }
}