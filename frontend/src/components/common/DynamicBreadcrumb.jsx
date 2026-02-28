import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { Home } from 'lucide-react';

const DynamicBreadcrumb = () => {
    const location = useLocation();

    const pathnames = location.pathname.split('/').filter((x) => x);

    const routeLabels = {
        'events': 'Events',
        'recruitments': 'Recruitments',
        'profile': 'Profile',
        'home': 'Home',
    };

    const formatName = (name) => {
        return routeLabels[name] || name.charAt(0).toUpperCase() + name.slice(1);
    };

    const breadcrumbItems = [
        {
            title: (
                <Link to="/" className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    Home
                </Link>
            ),
        }
    ];


    pathnames.forEach((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        breadcrumbItems.push({
            title: isLast ? (
                <span className="font-semibold text-gray-800">{formatName(value)}</span>
            ) : (
                <Link to={to}>{formatName(value)}</Link>
            ),
        });
    });

    return (
        <div className="mb-6">
            <Breadcrumb
                separator=">"
                items={breadcrumbItems}
                className="text-sm font-medium"
            />
        </div>
    );
};

export default DynamicBreadcrumb;