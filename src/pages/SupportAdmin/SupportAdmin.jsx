import React from 'react';

import { ChatEngine } from 'react-chat-engine'

const SupportAdmin = () => {
    return (
        <div className='w-100 p-2'>

            <ChatEngine
                projectID="79989f40-e618-4235-9dac-1610192cb984"
                userName='nhpn2003@gmail.com'
                userSecret='nhpn2003@gmail.com'
                height='calc(90vh - 60px)'
            />
        </div>
    );
}

export default SupportAdmin;