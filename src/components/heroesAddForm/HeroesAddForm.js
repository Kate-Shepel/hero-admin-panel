import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useHttp } from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store';

import { selectAll } from '../heroesFilters/filtersSlice';

import { heroCreated  } from '../heroesList/heroesSlice';

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
    const { filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Loading...</option>
        } else if (status === "error") {
            return <option>Loading error</option>
        }

        if (filters && filters.length > 0 ) {
            console.log(filters)
            return filters.map(({name, label}) => {
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

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
                            {renderFilters(filters, filtersLoadingStatus)}
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