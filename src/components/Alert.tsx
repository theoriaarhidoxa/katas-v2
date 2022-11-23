import React, {FC, useState} from 'react';
import './Alert.scss';
import {useContextEveryWhere} from "../context";
import {IAlertProps} from "../interfaces";

const Alert: FC<IAlertProps> = props => {
    const {onCancel, onSubmit} = props;
    const {notify, notNotified} = useContextEveryWhere();
    const [progressValue, setProgressValue] = useState(0);

    const clearHistory = () => {
        onSubmit();
        const adjustValue = setInterval(() => {
            if (progressValue < 101) {
                setProgressValue(progressValue => progressValue + 1);
            }
        }, 10);

        setTimeout(() => {
            clearInterval(adjustValue);
        }, 1100);

        setTimeout(() => {
            notNotified();
        }, 2000);
    };

    return (
        <div className={notify ? 'alert' : 'alert animated'}>
            <i onClick={() => onCancel()}>&times;</i>
            <p>История просмотров заполнена.<br /> Для продолжения необходимо очистить её.</p>
            <button onClick={clearHistory} className='btn'>Очистить</button>
            <progress value={progressValue} max="100">70 %</progress>
        </div>
    );
};

export default Alert;
