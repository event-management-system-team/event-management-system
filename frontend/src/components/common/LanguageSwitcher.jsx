import React from 'react';
import { Dropdown, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    // Hàm xử lý đổi ngôn ngữ
    const changeLanguage = (langInfo) => {
        i18n.changeLanguage(langInfo.key);
    };

    // Cấu hình các item cho Dropdown menu của Ant Design
    const items = [
        {
            key: 'vi',
            label: '🇻🇳 Tiếng Việt',
            disabled: i18n.language === 'vi', // Khóa lại nếu đang là Tiếng Việt
        },
        {
            key: 'en',
            label: '🇺🇸 English',
            disabled: i18n.language === 'en', // Khóa lại nếu đang là Tiếng Anh
        },
    ];

    return (
        <Dropdown
            menu={{ items, onClick: changeLanguage }}
            placement="bottomRight"
            arrow
            trigger={['click']} // Có thể chọn 'hover' hoặc 'click'
        >
            {/* Nút hiển thị ngôn ngữ hiện tại */}
            <Button type="default" className="flex items-center gap-2">
                <GlobalOutlined />
                {i18n.language === 'vi' ? 'VI' : 'EN'}
            </Button>
        </Dropdown>
    );
};

export default LanguageSwitcher;
