import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useHttp } from '../../hooks/http.hook';
import { useDispatch } from 'react-redux';

import { heroCreated  } from '../../actions';

import './heroesAddForm.scss';
// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {

    const dispatch = useDispatch();
    const {request} = useHttp();

    return (
        <div className="hero__add-form">
            <Formik
                initialValues = {{
                    name: '',
                    text: '',
                    element: ''
                }}
                validationSchema = {Yup.object({
                    name: Yup.string().required('This field is required'),
                    text: Yup.string().required('This field is required'),
                    element: Yup.string().required('This field is required')
                })}
                onSubmit = {({name, text, element}, { resetForm }) => {
                    const newId = uuidv4();
                    const newHero = {
                        name,
                        description: text,
                        element,
                        id: newId
                    }
                    console.log(newHero);
                    request(`http://localhost:3001/heroes`, 'POST', JSON.stringify(newHero))
                        .then(data => console.log(data, 'posted'))
                        .then(dispatch(heroCreated(newHero)))
                        .catch(err => console.log(err));
                    resetForm();
                }}
            >
                <Form className="border p-4 shadow-lg rounded">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                        <Field 
                            type="text" 
                            name="name" 
                            className="form-control" 
                            id="name" 
                            placeholder="Как меня зовут?"/>
                    </div>
                    <ErrorMessage component="div" className="hero__add-error" name="name" />

                    <div className="mb-3">
                        <label htmlFor="text" className="form-label fs-4">Описание</label>
                        <Field
                            name="text" 
                            className="form-control" 
                            id="text" 
                            placeholder="Что я умею?"
                            style={{"height": '130px'}}/>
                    </div>
                    <ErrorMessage component="div" className="hero__add-error" name="text" />

                    <div className="mb-3">
                        <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                        <Field  
                            as="select"
                            className="form-select" 
                            id="element" 
                            name="element">
                            <option >Я владею элементом...</option>
                            <option value="fire">Огонь</option>
                            <option value="water">Вода</option>
                            <option value="wind">Ветер</option>
                            <option value="earth">Земля</option>
                        </Field>
                    </div>
                    <ErrorMessage component="div" className="hero__add-error" name="element" />
                    <button type="submit" className="btn btn-primary">Создать</button>
                </Form>
            </Formik>
        </div>
    )
}

export default HeroesAddForm;