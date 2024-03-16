import React from 'react';

import { Spinner } from 'flowbite-react';

export default function LoadingSpinner({loading}) {
    if (loading) {
      return (
        <div className="text-center block w-full">
          <Spinner aria-label="Default status example" size="xl"/>
        </div>
      );
    }

}