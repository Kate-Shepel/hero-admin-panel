
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { activeFilterChanged, fetchFilters } from './filtersSlice';
import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {

    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilters());

        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Loading error</h5>
    }

    const renderFilterButtons = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Filters haven't been found</h5>
        }

        return arr.map(({name, label, className}) => {

            // usage of classnames library and creating classes dynamically
            const btnClasses = classNames('btn', className, {
                'active': name === activeFilter
            });

            return <button 
                        key={name} 
                        id={name} 
                        className={btnClasses}
                        onClick={() => dispatch(activeFilterChanged(name))}
                        >{label}</button>
        })
    }

    const filterButtons = renderFilterButtons(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {filterButtons}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;