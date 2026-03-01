import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

const DynamicBreadcrumb = ({ baseColor = "text-slate-500", activeColor = "text-slate-800" }) => {

    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean)

    const routeLabels = {
        'events': 'Events',
        'recruitments': 'Recruitments',
        'me': 'Profile',
        'home': 'Home',
    };


    const breadcrumbItems = [
        { title: <Link to="/" className={`inline-flex items-center gap-1.5 whitespace-nowrap ${baseColor} hover:opacity-80 transition-opacity`}>Home</Link> },

        ...pathSegments.map((segment, index) => {
            const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSegments.length - 1;

            const label = routeLabels[segment] || 'Detail';

            return {
                title: isLast ? (
                    <span className={`font-semibold ${activeColor}`}>{label}</span>
                ) : (
                    <Link to={url} className={`${baseColor} hover:opacity-80 transition-opacity`}>{label}</Link>
                )
            };
        })
    ];


    return (
        <div className="mb-6">
            <Breadcrumb
                separator={<span className={baseColor}>&gt;</span>}
                items={breadcrumbItems}
                className="text-sm font-medium "
            />
        </div>
    );
};

export default DynamicBreadcrumb;