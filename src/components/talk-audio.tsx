import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TalkBubble } from './talk-bubble'
import { PauseCircle, PlayCircle, Volume, Volume1, Volume2, VolumeX } from 'lucide-react'
import clsx from 'clsx'

export function TalkAudio({
  urls,
  className,
  ...bubbleProps
}: { urls: string[] } & Omit<Parameters<typeof TalkBubble>[0], 'children'>) {
  const audioEle = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const currentAudioIndex = useRef(0)

  useEffect(() => {
    const ele = (audioEle.current = document.createElement('audio'))
    audioEle.current.src = urls[currentAudioIndex.current]

    document.body.appendChild(audioEle.current)

    ele.addEventListener('ended', () => {
      if (urls[++currentAudioIndex.current]) {
        ele.src = urls[currentAudioIndex.current]
        ele.play()
      } else {
        setPlaying(false)
        ele.pause()
        currentAudioIndex.current = 0
        ele.src = urls[currentAudioIndex.current]
      }
    })

    return () => {
      document.body.removeChild(ele)
    }
  }, [])

  const playAudio = useCallback(() => {
    if (playing) {
      setPlaying(false)
      audioEle.current?.pause()
    } else {
      setPlaying(true)
      audioEle.current?.play()
    }
  }, [playing, audioEle])

  return (
    <TalkBubble {...bubbleProps} className={clsx('cursor-pointer', className)}>
      <div className="flex justify-between w-[199px]" onClick={playAudio}>
        {playing ? <PlayingAudio /> : <VolumeX />}
        {playing ? <PauseCircle className="text-orange-400" /> : <PlayCircle className="text-orange-400" />}
      </div>
    </TalkBubble>
  )
}

function PlayingAudio() {
  const loopList = useRef([Volume, Volume1, Volume2])
  const [index, setIndex] = useState(0)

  const ShowComp = useMemo(() => loopList.current[index], [index])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((v) => {
        const newIndex = v + 1
        if (loopList.current[newIndex]) {
          return newIndex
        }
        return 0
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return <ShowComp />
}
