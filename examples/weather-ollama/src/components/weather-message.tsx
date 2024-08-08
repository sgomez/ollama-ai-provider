'use client'

import Image from 'next/image'
import { CurrentConditions } from 'openweather-api-node'

import { Message } from '@/components/message'

// Credits: https://www.creative-tim.com/twcomponents/component/weather-ui-component

export function WeatherMessage({
  current,
  location,
}: {
  current: CurrentConditions
  location: string
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0">
          <Message type="assistant">This is the weather in {location}</Message>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded p-4 border-1 border-gray-800 dark:border-gray-200 max-w-[400px] w-full">
            <div className="font-bold text-xl">{location}</div>
            <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg h-24 w-24">
              <Image
                src={current.icon.url}
                alt={current.description}
                height={256}
                width={256}
                className="w-24 h-24"
              />
            </div>
            <div className="flex flex-row items-center justify-center mt-6">
              <div className="font-medium text-6xl">
                {current.temp.cur.toFixed(0)}°
              </div>
              <div className="flex flex-col items-center ml-6">
                <div>{current.main}</div>
                <div className="mt-1">
                  <span className="text-sm">
                    <i className="far fa-long-arrow-up"></i>
                  </span>
                  <span className="text-sm font-light text-gray-500">
                    Feels like
                  </span>
                </div>
                <div>
                  <span className="text-sm">
                    <i className="far fa-long-arrow-down"></i>
                  </span>
                  <span className="text-sm font-light text-gray-500">
                    {current.feelsLike.cur.toFixed(0)}°C
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between mt-6">
              <div className="flex flex-col items-center">
                <div className="font-medium text-sm">Wind</div>
                <div className="text-sm text-gray-500">
                  {current.wind.speed}km/h
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium text-sm">Humidity</div>
                <div className="text-sm text-gray-500">
                  {current.humidity.toFixed(0)}%
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium text-sm">Visibility</div>
                <div className="text-sm text-gray-500">
                  {(current.visibility / 1000).toFixed(0)}km
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
