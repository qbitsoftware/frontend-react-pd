import React from 'react';
import './TableTennisLoader.css';

interface TableTennisLoaderProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

const TableTennisLoader: React.FC<TableTennisLoaderProps> = ({
    size = 'medium',
    color = '#ff2121'
}) => {
    return (
        <div className={`table-tennis-loader ${size}`}>
            <div className="racket" style={{ backgroundColor: color }}>
                <div className="racket-handle"></div>
                <div className="racket-strings"></div>
            </div>
            <div className="ball"></div>
        </div>
    );
};

export default TableTennisLoader;
