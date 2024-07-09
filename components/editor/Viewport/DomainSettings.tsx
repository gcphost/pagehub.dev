import { useEditor } from '@craftjs/core';
import debounce from 'lodash.debounce';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  TbCheck, TbLock, TbLogin, TbLogout, TbX
} from 'react-icons/tb';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { SettingsAtom } from 'utils/atoms';
import { popupCenter } from 'utils/lib';
import { UnsavedChangesAtom } from '.';
import { SaveToServer } from './lib';

export const DomainSettings = () => {
  const [settings, setSettings] = useRecoilState(SettingsAtom);
  const { data: session, status } = useSession();

  const [data, setData] = useState(settings);
  const [name, setName] = useState(data?.name || '');
  const [nameOk, setNameOk] = useState(null);
  const [publishType, setPublishType] = useState(
    status === 'authenticated'
      ? settings.domain
        ? 'domain'
        : 'local'
      : 'draft'
  );
  const [saving, setSaving] = useState(false);
  const [domainData, setDomainData] = useState(null);
  const setUnsavedChanged = useSetRecoilState(UnsavedChangesAtom);
  const {
    enabled, canUndo, canRedo, actions, query
  } = useEditor(
    (state, query) => ({
      enabled: state.options.enabled,
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
    })
  );
  const save = async () => {
    setSaving(true);
    const {
      name, title, description, _id, domain
    } = data;
    let result = null;

    // console.log({ data });

    const body = {
      title,
      description,
      _id: settings._id,
      type: 'publish',
      publishType,
    };

    if (name) {
      body.name = name;
    }
    if (domain) {
      body.domain = domain;
    }

    // console.log({ body });

    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      result = await res.json();

      // console.log("saved", result);
    } catch (e) {
      console.error(e);
    }

    // setDialogOpen(false);

    if (publishType !== 'draft') {
      await SaveToServer(query.serialize(), false, result, setSettings);
      setUnsavedChanged(false);
    }

    result && setSettings(result);
    setSaving(false);
  };

  const change = (key, val) => {
    const a = { ...data };

    a[key] = val;
    setData(a);
  };

  const checkName = async (name) => {
    setName(name);
    const res = await fetch('/api/check', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    let result = null;

    try {
      result = await res.json();
    } catch (e) {
      console.error(e);
    }

    if (result.name) {
      return setNameOk(false);
    }

    change('name', name);
    setNameOk(true);
  };

  useEffect(() => {
    const run = () => {
      fetch('/api/domain', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: settings.domain }),
      }).then(async (res) => {
        const r = await res.json();
        // console.log("d", r);
        setDomainData(r);
      });
    };

    run();
    const interval = setInterval(() => run, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [settings?.domain]);

  const inputClass = 'input  ';

  if (!settings) {
    return null;
  }

  return (
    <form
      autoComplete="false"
      onSubmit={(e) => {
        e.preventDefault();
        if (saving) return;
        save();
      }}
    >
      <div className="space-y-4 pb-4 sm:pb-6 px-3 xl:pb-8">
        <div className="flex items-center gap-3 cursor-pointer  p-3">
          {status === 'authenticated' ? (
            <div className="mx-auto  flex flex-row gap-3 items-center text-lg">
              <p className="text-center">Logged in as {session.user.email}</p>{' '}
              <div
                className="cursor-pointer"
                onClick={() => popupCenter('/google-signout', 'Sign Out')}
              >
                <TbLogout />
              </div>
            </div>
          ) : (
            <div
              className="btn px-6 py-3 mx-auto cursor-pointer"
              onClick={() => popupCenter('/google-signin', 'Sign In')}
            >
              Sign in with Google &nbsp;
              <TbLogin />
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-3 mx-auto">
          <label className="text-center mx-auto items-center flex gap-1">
            <input
              type="checkbox"
              defaultChecked={false}
              className="input w-6 h-6 mr-3"
              required={true}
            />{' '}
            I agree to the{' '}
            <a
              href="https://pagehub.dev/terms"
              target="_blank"
              className="text-gray-300 underline"
            >
              Terms of Service
            </a>
          </label>
        </div>

        <hr className="border-b border-gray-500 -mx-3" />

        <div>
          <label>Title</label>
          <input
            type="text"
            autoFocus={settings.name}
            placeholder="Site Title"
            required={true}
            defaultValue={settings.title}
            onChange={(e) => change('title', e.target.value)}
            className={inputClass}
            data-gramm="false"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            placeholder="Site Description"
            required={true}
            defaultValue={settings.description}
            onChange={(e) => change('description', e.target.value)}
            className={inputClass}
            data-gramm="false"
          />
        </div>

        <hr className="border-b border-gray-500 -mx-3" />

        <div className="flex flex-col gap-3">
          <label
            className="cursor-pointer flex flex-row items-center gap-2"
            onClick={() => status === 'authenticated' && setPublishType('local')
            }
          >
            <input
              type="radio"
              name="local"
              className="input w-3"
              checked={publishType === 'local'}
            />{' '}
            Publish to pagehub.dev
            {status !== 'authenticated' && <TbLogin />}
          </label>

          <label
            className="cursor-pointer flex flex-row items-center gap-2"
            onClick={() => status === 'authenticated' && setPublishType('domain')
            }
          >
            <input
              type="radio"
              name="domain"
              className="input w-3"
              checked={publishType === 'domain'}
            />{' '}
            Publish to your own domain
            {status !== 'authenticated' && <TbLogin />} <TbLock />
          </label>

          <label
            className="cursor-pointer flex flex-row items-center gap-2"
            onClick={() => setPublishType('draft')}
          >
            <input
              type="radio"
              name="draft"
              className="input w-3"
              checked={publishType === 'draft'}
            />{' '}
            Save as draft
          </label>
        </div>

        {publishType === 'local' && (
          <div className="flex flex-col">
            <div className="flex flex-row items-center ">
              <input
                type="text"
                autoFocus={!settings.name}
                placeholder={settings.name || 'name'}
                data-gramm="false"
                data-lpignore="true"
                autoComplete="off"
                onChange={debounce((e) => checkName(e.target.value), 500)}
                className={`${inputClass} focus:ring-0   rounded-lg   w-8/12 border-0 text-right pr-0 active:border-white focus:border-white focus:outline-none`}
              />
              .pagehub.dev
              {name && nameOk !== null ? (
                nameOk ? (
                  <span className="ml-3 bg-green-100 w-8 items-center justify-center flex  text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    <TbCheck />
                  </span>
                ) : (
                  <span className="ml-3 bg-red-100 w-8 items-center justify-center flex  text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    <TbX />
                  </span>
                )
              ) : null}
            </div>
          </div>
        )}

        {publishType === 'draft' && (
          <div>
            This page will be viewable at{' '}
            <strong>
              {settings.draftId}
              .pagehub.dev
            </strong>
          </div>
        )}

        {publishType === 'domain' && (
          <>
            <div>
              <input
                type="text"
                placeholder="domain.tld"
                defaultValue={settings.domain}
                onChange={(e) => change('domain', e.target.value)}
                className={inputClass}
                data-gramm="false"
                pattern="^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$"
              />
            </div>
            <p className="text-xs p-3 text-center">
              Changes will be visible shortly after saving.
            </p>
          </>
        )}

        {settings.error && (
          <div className="bg-red text-white rounded-xl p-3 w-fit">
            {settings.error}
          </div>
        )}

        {!settings.error
          && domainData?.name
          && !domainData?.configVerifiedAt && (
            <div>
              Set the following record on your DNS provider to continue:
              <div className="bg-white text-black my-6 p-3 rounded-xl w-full overflow-auto">
                <table className="table-auto p-3">
                  <tbody>
                    <tr className="font-bold">
                      <td className="divide-x divide-gray-300 px-4 py-2">
                        Type
                      </td>
                      <td className="divide-x divide-gray-300 px-4 py-2">
                        Name
                      </td>
                      <td className="divide-x divide-gray-300 px-4 py-2">
                        Value
                      </td>
                    </tr>
                    <tr className="">
                      <td className="divide-x divide-gray-300 px-4 py-2">A</td>
                      <td className="divide-x divide-gray-300 px-4 py-2">@</td>
                      <td className="divide-x divide-gray-300 px-4 py-2">
                        76.76.21.21
                      </td>
                    </tr>

                    {domainData?.verification?.map((_) => (
                        <tr className="">
                          <td className="divide-x divide-gray-300 px-4 py-2">
                            {_.type}
                          </td>
                          <td className="divide-x divide-gray-300 px-4 py-2">
                            {_.domain}
                          </td>
                          <td className="divide-x divide-gray-300 px-4 py-2">
                            {_.value}
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}

        <div className="w-full  ">
          <button
            className={`${
              saving ? 'bg-violet-300' : 'bg-violet-500'
            } btn w-full p-3`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
};
