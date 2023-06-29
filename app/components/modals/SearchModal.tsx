'use client';

import { useCallback, useMemo, useState } from "react";
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation';

import qs from 'query-string';
import { Range } from 'react-date-range';
import { formatISO } from 'date-fns';

import {useSearchModal} from "@/app/hooks/useSearchModal";

import {Modal} from "./Modal";
import {Heading} from '../Heading';
import {Calendar} from "../inputs/Calendar";
import {Counter} from "../inputs/Counter";
import { CountrySelect, CountrySelectValue} from "../inputs/CountrySelect";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION);

  const [location, setLocation] = useState<CountrySelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  //import especial for Map. 
  const Map = useMemo(() => {
    const dummyVariable = location
    return dynamic(() => import('../Map').then((modal)=>modal.Map), {
    ssr: false 
  })}, [location]);

  //controlers
  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  //onsubmit botton to apply filters
  const onSubmit = useCallback(async () => {
    // if its not on the last step. 
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    // to get query parsed from parms 
    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    //UPDATING QUERY
    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    // to change the url with query parameters
    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, { skipNull: true });

    // go back to location and close the modal
    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, 
  [
    step, 
    searchModal, 
    location, 
    router, 
    guestCount, 
    roomCount,
    dateRange,
    onNext,
    bathroomCount,
    params
  ]);

  //labels for controlers 
  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search'
    }

    return 'Next'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined
    }

    return 'Back'
  }, [step]);

// if STEP is in Location. 
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you wanna go?"
        subtitle="Find the perfect location!"
      />
      <CountrySelect 
        value={location} 
        onChange={(value) => 
          setLocation(value as CountrySelectValue)} 
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  )

  // if STEP is in DATE. 
  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you plan to go?"
          subtitle="Make sure everyone is free!"
        />
        <Calendar
          onChange={(value) => setDateRange(value.selection)}
          value={dateRange}
        />
      </div>
    )
  }

    // if STEP is in INFO. 
  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="More information"
          subtitle="Find your perfect place!"
        />
        <Counter 
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
          title="Guests" 
          subtitle="How many guests are coming?"
        />
        <hr />
        <Counter 
          onChange={(value) => setRoomCount(value)}
          value={roomCount}
          title="Rooms" 
          subtitle="How many rooms do you need?"
        />        
        <hr />
        <Counter 
          onChange={(value) => {
            setBathroomCount(value)
          }}
          value={bathroomCount}
          title="Bathrooms"
          subtitle="How many bahtrooms do you need?"
        />
      </div>
    )
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Filters"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      sencondaryActionLabel={secondaryActionLabel}
      sencondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
}

export default SearchModal;